const Activation = require('./../Activation.js');

class Neuron {

	/**
	 * Constructor for Hidden Neuron
	 * @param {string} label 
	 */
	constructor(label,layer) {
		this.label 			= label; 	 // Human readable label
		this.layer			= layer;	 // Layer that contains the neuron
		this.inputs 		= [];        // Reference to the input synapses
		this.outputs 		= [];    	 // Reference to the output synapses
		this.signal 		= 0;		 // Received signal
		this.activation 	= 0;     	 // Activation of the neuron
		this.error 			= 0;     	 // Error to be persisted (not actually used in Input neuron, more kept for interest)
		this.setActivationType('sigmoid'); // Neuron activation function (defaulting to sigmoid)
	}

	setActivationType(type) {
		this.activationType = type;
		this.activationFunc = Activation.calculate(this.activationType);
		this.derivativeFunc = Activation.calculate(this.activationType,true);
	}

	isBias() {
		return false;
	}

	/**
	 * Reset neuron to initial state
	 */
	reset() {
		this.signal 		= 0;
		this.activation 	= 0;
		this.error 			= 0;  
	}
	
	/**
	 * Receive input signal and propagate activation to output synapses
	 */
	fire() {
		this.signal = 0;
		for(let input of this.inputs) {
			//console.log('input.activation',input.label,input.activation)
			this.signal += input.activation;
		}
		this.activation = this.activationFunc(this);
		//console.log(this.label,'this.activation',this.activation,this.activationType);
		for(let output of this.outputs) {
			output.fire(this.activation);
		}
	}

	/**
	 * Receive back propagated errors from output synapses and sum for error 
	 */
	backPropagate() {
		this.signal = 0;
		for(let output of this.outputs) {
			this.signal += output.activation;
		}
		this.error = this.signal + this.derivativeFunc(this.activation);
		for(let input of this.inputs) {
			input.backPropagate(this.error);
		}
	}

	/**
	 * Uses activation maximisation to discover the path of activation 
	 * needed to activate this neuron to the supplied signal
	 * @param {float} signal
	 * @param {integer} count
	 */
	mapActivation(signal,count = null) {
		if(!this.hasOwnProperty('mappedSignals')) this.mappedSignals = [];
		this.mappedSignals.push(signal);
		if(count === null || this.mappedSignals.length === count) {	
			this.activation = this.mappedSignals.reduce((a,s) => a+s,0);
			const expectedCount = count === null ? 1 : this.layer.neurons.filter(i => i.input.constructor.name !== 'Bias').length;
			for(let input of this.inputs) {
				const activation = this.activationFunc(this.activation);
				input.mapActivation(activation,expectedCount);
			}
			delete this.mappedSignals;
		}
	}

	toObject() {
		return {
			type: this.constructor.name,
			label: this.label,
			activationType: this.activationType,
			outputs: this.outputs.map(o => o.toObject())
		};
	}
};

module.exports = Neuron;