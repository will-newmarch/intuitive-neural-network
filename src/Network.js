const fs 		= require('fs');
const ervy 		= require('ervy');

const Layer 	= require('./Layer.js');
const Input 	= require('./neuron/Input.js');
const Hidden 	= require('./neuron/Hidden.js');
const Output 	= require('./neuron/Output.js');
const Bias 		= require('./neuron/Bias.js');
const Synapse 	= require('./Synapse.js');

const Preprocessor = require('./Preprocessor.js');

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
			bias: true,
			loss: null
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
			let neuron = new Input('input-' + i,inputLayer)
			inputLayer.neurons.push(neuron);
		}
		if(this.settings.bias) {
			let bias = new Bias('input-bias',inputLayer);
			bias.setActivationType(this.settings.hiddenActivationType);
			inputLayer.neurons.push(bias);
		}
		this.layers.push(inputLayer);
		// Hidden layers...
		for (var i = 0; i < this.settings.layers.length - 2; i++) {
			var hiddenLayer = new Layer('hidden-'+i,Layer.HIDDEN);
			for(var j = 0; j < this.settings.layers[i+1]; j++) {
				let neuron = new Hidden('hidden-'+j,hiddenLayer);
				neuron.setActivationType(this.settings.hiddenActivationType);
				hiddenLayer.neurons.push(neuron);
			}
			if(this.settings.bias) {
				let bias = new Bias('hidden-bias',hiddenLayer);
				bias.setActivationType(this.settings.hiddenActivationType);
				hiddenLayer.neurons.push(bias);
			}
			this.layers.push(hiddenLayer);
		}
		// Output layer...
		var outputLayer = new Layer('output',Layer.OUTPUT);
		for(var i = 0; i < this.settings.layers[this.settings.layers.length-1]; i++) {
			let neuron = new Output('output-' + i,outputLayer);
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
		for (var i = 0; i < signals.length; i++) {
			this.layers[0].neurons[i].fire(signals[i]); // Fire signals to neurons on the first layer.
		}
		for (var i = 1; i < this.layers.length; i++) { // Fire the next neurons in sequence.
			for(let neuron of this.layers[i].neurons) {
				neuron.fire();
			}
		}
		return this;
	}

	/**
	 * Initialise back propagation through network with supplied array of floats
	 * @param {array} expected 
	 * @returns Network (for chaining purposes)
	 */
	backPropagate(expected) {
		const activations = this.layers[this.layers.length-1].neurons.map(n => n.activation);
		const errors = this.computeErrors(expected,activations);
		for (var i = 0; i < errors.length; i++) {
			this.layers[this.layers.length-1].neurons[i].backPropagate(errors[i]);
		}
		for (var i = this.layers.length-2; i >= 0; i--) { // Fire the next neurons in sequence.
			for(let n of this.layers[i].neurons) {
				n.backPropagate();
			}
		}
		return this;
	}

	mapActivation(activation) {
		for (var i = 0; i < activation.length; i++) {
			this.layers[this.layers.length-1].neurons[i].mapActivation(activation[i]);
		}
		for (var i = this.layers.length-2; i >= 0; i--) { // Fire the next neurons in sequence.
			for(let n of this.layers[i].neurons) {
				n.mapActivation();
			}
		}
		return this.normaliseInputActivation();
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
	 * Train the network
	 * @param {Object} data { x: [INPUT_DATA], y: [OUTPUT_DATA]}
	 * @param {Number} learningRate 
	 */
	train(data,learningRate = 0.01) {
		for (var index = 0, len = data.length; index < len; index++) {
			let sample = Math.floor(Math.random() * data.length);
			this.fire(data[sample].x)
				.backPropagate(data[sample].y)
				.applyError(learningRate)
				.reset();
		}
	}

	/**
	 * Test the network
	 * @param {Object} data { x: [INPUT_DATA], y: [OUTPUT_DATA]}
	 * @returns error
	 */
	test(data) {
		let errorSum = 0;
		// Testing the trained network...
		for(var index = 0, len = data.length; index < len; index++) {
			this.fire(data[index].x);
			const activations = this.layers[this.layers.length-1].neurons.map(n => n.activation);
			errorSum += this.computeErrors(data[index].y,activations).reduce((a,v) => a+v,0);
			this.reset();
		}
		return errorSum / data.length;
	}

	computeErrors(expected,predicted) {
		const errors = [];
		for (let i = 0; i < expected.length; i++) {
			if(this.settings.loss == 'mse') {
				errors.push(Math.pow((predicted[i] - expected[i]), 2));
			} else if(this.settings.loss == 'cee') {
				if(expected[i] == 1) {
					errors.push(-Math.log(expected[i] - predicted[i]));
				} else {
					errors.push(-Math.log(1 - (expected[i] - predicted[i])));
				}
			} else {
				errors.push(predicted[i] - expected[i]);
			}
		}
		return errors;
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

	/**
	 * Generate simple chart in terminal
	 * @param {Array} errors 
	 */
	visualiseErrors(errors) {
		// Nice little graphic!
		const chartData = errors.map((m,i) => {
			return { key: ''+(i+1), value: m.toFixed(2), style: ervy.bg('blue') };
		});
		console.log(ervy.bar(chartData,{barWidth: 4}));
	}

	normaliseInputActivation() {
		const inputActivation = this.layers[0].neurons.map(n => n.activation);
		return Preprocessor.normalise([inputActivation])[0];
	}

	/**
	 * Translate the network into a JSON format
	 */
	toJSON() {
		return JSON.stringify({
			layers: this.layers.map(l => l.toObject())
		});
	}

	/**
	 * Save the network as JSON to a file
	 * @param {String} filename 
	 * @param {Function} callback 
	 */
	save(filename,callback = () => {}) {
		const model = this.toJSON();
		fs.writeFile(filename, model, callback);
	}

	/**
	 * Save the network as JSON to a file synchronously
	 * @param {String} filename 
	 */
	saveSync(filename) {
		const model = this.toJSON();
		fs.writeFileSync(filename, model);
	}

	/**
	 * Load a network model from JSON in a file
	 * @param {String} filename 
	 */
	loadSync(filename) {
		const model = JSON.parse(fs.readFileSync(filename,'utf8'));
		// Hydrate layers and neurons
		this.layers = [];
		for(let layer of model.layers) {
			const layerType = 
				this.layers.length < 1 ? 'input'
				: this.layers.length == model.layers.length - 1 ? 'output'
				: 'hidden';
			const newLayer = new Layer(layerType == 'hidden' ? layerType + '-' + this.layers.length : layerType);
			for(let neuron of layer.neurons) {
				let newNeuron;
				switch(neuron.type) {
				case 'Input':  
					newNeuron = new Input(neuron.label,newLayer); break;
				case 'Hidden': 
					newNeuron = new Hidden(neuron.label,newLayer); break;
				case 'Output': 
					newNeuron = new Output(neuron.label,newLayer); break;
				case 'Bias':   
					newNeuron = new Bias(neuron.label,newLayer); break;
				}
				newNeuron.label = neuron.label;
				newNeuron.setActivationType(neuron.activationType);
				newLayer.neurons.push(newNeuron);
			}
			this.layers.push(newLayer);
		}
		// Connect neurons with synapses
		const oldNeurons = model.layers.reduce((a,l) => [].concat(a,l.neurons),[]);
		const newNeurons = this.layers.reduce((a,l) => [].concat(a,l.neurons),[]);
		for(let neuron of oldNeurons) {
			for(let output of neuron.outputs) {
				const inputNeuron  = newNeurons.find(n => n.label === output.inputLabel);
				const outputNeuron = newNeurons.find(n => n.label === output.outputLabel);
				const newSynapse   = new Synapse(inputNeuron,outputNeuron);
				inputNeuron.outputs.push(newSynapse);
				outputNeuron.inputs.push(newSynapse);
				newSynapse.weight = parseFloat(output.weight);
			}
		}
	}
};

module.exports = Network;