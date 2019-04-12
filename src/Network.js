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
		var inputLayer = new Layer('input');
		for(var i = 0; i < this.settings.layers[0]; i++) {
			let neuron = new Input('input-' + i)
			inputLayer.neurons.push(neuron);
		}
		if(this.settings.bias) {
			let bias = new Bias('input-bias');
			bias.activationType = this.settings.hiddenActivationType;
			inputLayer.neurons.push(bias);
		}
		this.layers.push(inputLayer);
		// Hidden layers...
		for (var i = 0; i < this.settings.layers.length - 2; i++) {
			var hiddenLayer = new Layer('hidden-'+i);
			for(var j = 0; j < this.settings.layers[i+1]; j++) {
				let neuron = new Hidden('hidden-'+j);
				neuron.activationType = this.settings.hiddenActivationType;
				hiddenLayer.neurons.push(neuron);
			}
			if(this.settings.bias) {
				let bias = new Bias('hidden-bias');
				bias.activationType = this.settings.hiddenActivationType;
				hiddenLayer.neurons.push(bias);
			}
			this.layers.push(hiddenLayer);
		}
		// Output layer...
		var outputLayer = new Layer('output');
		for(var i = 0; i < this.settings.layers[this.settings.layers.length-1]; i++) {
			let neuron = new Output('output-' + i);
			neuron.activationType = this.settings.outputActivationType;
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
						if(nextNeuron.constructor.name == 'Bias') continue;
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
		for (var i = 0, len = this.layers[0].neurons.length; i < len; i++) {
			this.layers[0].neurons[i].fire(signals[i]); // Fire the neurons on the first layer.
		}
		for (var i = 0, len = this.layers.length; i < len; i++) {
			this.layers[i].neurons.map(n => {
				if(n.constructor.name == 'Bias') n.fire(); // TODO - refactor; we shouldnt need to poke the bias's separately!
			});
		}
		return this;
	}

	/**
	 * Initialise back propagation through network with supplied array of floats
	 * @param {array} expected  // TODO
	 * @returns Network (for chaining purposes)
	 */
	backPropagate(expected) {
		for (var i = 0, len = expected.length; i < len; i++) {
			this.layers[this.layers.length-1].neurons[i].backPropagate(expected[i]);
		}
		return this;
	}

	/**
	 * Trigger each synapse to apply its error to its weight
	 * @param {float} learningRate 
	 * @returns Network (for chaining purposes)
	 */
	applyError(learningRate) {
		this.layers.map(l => {
			l.neurons.map(n => {
				if(n.outputs) {
					n.outputs.map(o => {
						o.applyError(learningRate);
					});
				}
			});
		});
		return this;
	}

	/**
	 * Get the loss of the network
	 */
	loss() {
		let loss = 0;
		for (var i = 1; i < this.layers.length; i++) {
			for (var j = 0; j < this.layers[i].neurons.length; j++) {
				loss += this.layers[i].neurons[j].error;
			}
		}
		return loss;
	}

	/**
	 * Reset all the Neurons and Synapses back to their initial state
	 * @returns Network (for chaining purposes)
	 */
	reset() {
		this.layers.map(l => {
			l.neurons.map(n => {
				n.reset();
				if(n.outputs) {
					n.outputs.map(o => {
						o.reset();
					});
				}
			});
		});
		return this;
	}

	/**
	 * Log the network in a human readable fashion
	 */
	log(synapses = false) { // This could definitely be improved...
		this.layers.map(l => {
			l.neurons.map(n => console.log(n.label,n.outputs.map(s => s.weight)));
		});
	}
};

module.exports = Network;