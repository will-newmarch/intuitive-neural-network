const fs 		= require('fs');

const Layer 	= require('./Layer.js');
const Input 	= require('./neuron/Input.js');
const Hidden 	= require('./neuron/Hidden.js');
const Output 	= require('./neuron/Output.js');
const Bias 		= require('./neuron/Bias.js');
const Synapse 	= require('./Synapse.js');

class Network {

	/**
	 * Constructor for Network
	 * @param {object} settings 
	 */
	constructor(settings = {}) {

		// Amalgamate settings
		this.settings = Object.assign({
			layers: [10,16,16,1],
			hiddenActivationType: 'sigmoid',
			outputActivationType: 'identity',
			bias: true
		},settings);

		// Initialise layers array
		this.layers = [];

		// Generate the Neurons...
		this.generate();

		// Connect them with Synapses...
		this.connect();

	}

	/**
	 * Generate the network's Neurons as per the settings
	 */
	generate() {
		// Input layer...
		var inputLayer = new Layer('input',Layer.INPUT);
		for(var i = 0; i < this.settings.layers[0]; i++) {
			let neuron = new Input('input-' + i)
			inputLayer.neurons.push(neuron);
		}
		if(this.settings.bias) {
			let bias = new Bias('input-bias');
			bias.setActivationType(this.settings.hiddenActivationType);
			inputLayer.neurons.push(bias);
		}
		this.layers.push(inputLayer);
		// Hidden layers...
		for (var i = 0; i < this.settings.layers.length - 2; i++) {
			var hiddenLayer = new Layer('hidden-'+i,Layer.HIDDEN);
			for(var j = 0; j < this.settings.layers[i+1]; j++) {
				let neuron = new Hidden('hidden-'+j);
				neuron.setActivationType(this.settings.hiddenActivationType);
				hiddenLayer.neurons.push(neuron);
			}
			if(this.settings.bias) {
				let bias = new Bias('hidden-bias');
				bias.setActivationType(this.settings.hiddenActivationType);
				hiddenLayer.neurons.push(bias);
			}
			this.layers.push(hiddenLayer);
		}
		// Output layer...
		var outputLayer = new Layer('output',Layer.OUTPUT);
		for(var i = 0; i < this.settings.layers[this.settings.layers.length-1]; i++) {
			let neuron = new Output('output-' + i);
			neuron.setActivationType(this.settings.outputActivationType);
			outputLayer.neurons.push(neuron);
		}
		this.layers.push(outputLayer);
	}

	/**
	 * Connect the network's Neurons with Synapses
	 */
	connect() {
		for(var i = 0; i < this.layers.length; i++) {
			var currentLayer = this.layers[i];
			var nextLayer = this.layers[i+1];
			if(nextLayer) {
				for(var j = 0; j < currentLayer.neurons.length; j++) {
					var currentNeuron = currentLayer.neurons[j];
					for(var k = 0; k < nextLayer.neurons.length; k++) {
						var nextNeuron = nextLayer.neurons[k];
						if(nextNeuron.isBias()) continue;
						let synapse = new Synapse(currentNeuron,nextNeuron);
						currentNeuron.outputs.push(synapse);
						nextNeuron.inputs.push(synapse);
					}
				}
			}
		}
	}

	/**
	 * Fire the input layer's Neurons with supplied array of floats
	 * @param {array} signals 
	 * @returns Network (for chaining purposes)
	 */
	fire(signals) {
		for (var i = 0; i < this.layers[0].neurons.length; i++) {
			this.layers[0].neurons[i].fire(signals[i]); // Fire the neurons on the first layer.
		}
		for (var i = 0; i < this.layers.length; i++) {
			for(let n of this.layers[i].neurons) {
				if(n.isBias()) n.fire(); // TODO - refactor; we shouldnt need to poke the bias's separately!
			}
		}
		return this;
	}

	/**
	 * Initialise back propagation through network with supplied array of floats
	 * @param {array} errors 
	 * @returns Network (for chaining purposes)
	 */
	backPropagate(errors) {
		for (var i = 0; i < errors.length; i++) {
			this.layers[this.layers.length-1].neurons[i].backPropagate(errors[i]);
		}
		return this;
	}

	/**
	 * Trigger each synapse to apply its error to its weight
	 * @param {float} learningRate 
	 * @returns Network (for chaining purposes)
	 */
	applyError(learningRate) {
		for(let l of this.layers) {
			if(!l.isOutput()) {
				for(let n of l.neurons) {
					if(n.outputs) {
						for(let o of n.outputs) {
							o.applyError(learningRate);
						}
					}
				}
			}
		}
		return this;
	}

	/**
	 * Get the total error of the network
	 */
	error() {
		let totalError = 0;
		for (var i = 1; i < this.layers.length; i++) {
			for (var j = 0; j < this.layers[i].neurons.length; j++) {
				totalError += this.layers[i].neurons[j].error;
			}
		}
		return totalError;
	}

	/**
	 * Reset all the Neurons and Synapses back to their initial state
	 * @returns Network (for chaining purposes)
	 */
	reset() {
		for(let l of this.layers) {
			for(let n of l.neurons) {
				n.reset();
				if(n.outputs) {
					for(let o of n.outputs) {
						o.reset();
					}
				}
			}
		}
		return this;
	}

	toJSON() {
		return JSON.stringify({
			layers: this.layers.map(l => l.toObject())
		});
	}

	save(filename,callback) {
		const model = this.toJSON();
		fs.writeFile(filename, model, callback);
	}
};

module.exports = Network;