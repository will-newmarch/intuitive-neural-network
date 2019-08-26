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
			this.signal += input.activation;
		}
		this.activation = this.activationFunc(this);
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
	 */
	mapActivation() {
		let signal = 0;
		for(let output of this.outputs) {
			signal += output.activation;
		}
		for(let input of this.inputs) {
			input.mapActivation(signal);
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