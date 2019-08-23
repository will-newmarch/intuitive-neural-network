const fs 		= require('fs');
const mse 		= require('./utils/mse.js');
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
		for (var i = 0; i < signals.length; i++) {
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

	// /**
	//  * Train the network
	//  * @param {Object} data { x: [INPUT_DATA], y: [OUTPUT_DATA]}
	//  * @param {Object} options 
	//  */
	// train(data,options = {}) {
	// 	Object.assign(options,{
	// 		iterations: 5000,
	// 		learningRate: 0.05
	// 	});
	// 	// TODO
	// }

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
	 * @returns MSE
	 */
	test(data) {
		let errorSum = 0;
		// Testing the trained network...
		for(var index = 0, len = data.length; index < len; index++) {
			this.fire(data[index].x);
			const activation = this.layers[this.layers.length-1].neurons[0].activation;
			const error = activation - data[index].y;
			errorSum += mse([error]);
			this.reset();
		}
		return errorSum / data.length;
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
	 * @param {Array} mses 
	 */
	visualiseMSEs(mses) {
		// Nice little graphic!
		const chartData = mses.map((m,i) => {
			return { key: ''+(i+1), value: m.toFixed(2), style: ervy.bg('blue') };
		});
		console.log(ervy.bar(chartData,{barWidth: 4}));
	}

	normaliseInputActivation() {
		const inputActivation = this.layers[0].neurons.map(n => n.activation);
		return Preprocessor.normalise([inputActivation]);
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
					newNeuron = new Input(neuron.label); break;
				case 'Hidden': 
					newNeuron = new Hidden(neuron.label); break;
				case 'Output': 
					newNeuron = new Output(neuron.label); break;
				case 'Bias':   
					newNeuron = new Bias(neuron.label); break;
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