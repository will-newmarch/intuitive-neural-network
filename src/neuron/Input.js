const Neuron = require('./Neuron.js');

class Input extends Neuron {

	/**
	 * Constructor for Input Neuron
	 * @param {string} label 
	 */
	constructor(label) {
		super(label);
	}

	/**
	 * Reset neuron to initial state
	 */
	reset() {
		this.outputSignals 	= [];
		this.activation 	= 0;
		this.error 			= 0;  
	}

	/**
	 * Receive input signal and propagate activation to output synapses
	 * @param {float} signal 
	 */
	fire(signal) {
		this.activation = signal;
		for (var i = 0; i < this.outputs.length; i++) {
			this.outputs[i].fire(this.activation);
		}
	}

	/**
	 * Receive back propagated errors from output synapses and sum for error
	 * (This is more just for debugging/analysis - the error value is not actually used)
	 * @param {float} backSignal 
	 */
	backPropagate(backSignal) {
		this.outputSignals.push(backSignal);
		if(this.outputSignals.length === this.outputs.length) {
			const backPropagatedSignal = this.outputSignals.reduce((a,v) => a+v,0);
			this.error = backPropagatedSignal;
		}
	}
};

module.exports = Input;