const Activation = require('./../Activation.js');

class Neuron {

	/**
	 * Constructor for Hidden Neuron
	 * @param {string} label 
	 */
	constructor(label) {
		this.label 			= label; 	 // Human readable label
		this.activation 	= 0;     	 // Activation of the neuron
		this.error 			= 0;     	 // Error to be persisted (not actually used in Input neuron, more kept for interest)
		this.activationType = 'sigmoid'; // Neuron activation function (defaulting to sigmoid)
		this._activationFn  = Activation.calculate(this.activationType);
		this._derivativeFn  = Activation.calculate(this.activationType,true);
	}

	/**
	 * Reset neuron to initial state
	 */
	reset() {
		this.activation 	= 0;
		this.error 			= 0;  
	}
	
	/**
	 * Receive input signal and propagate activation to output synapses
	 * @param {float} signal 
	 */
	fire(signal) {
		throw 'fire method must be overidden!';
	}

	/**
	 * Receive back propagated errors from output synapses and sum for error
	 * @param {float} backSignal 
	 */
	backPropagate(backSignal) {
		throw 'backPropagate method must be overidden!';
	}
};

module.exports = Neuron;