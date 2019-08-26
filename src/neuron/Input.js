const Neuron = require('./Neuron.js');

class Input extends Neuron {

	/**
	 * Constructor for Input Neuron
	 * @param {string} label 
	 */
	constructor(label,layer) {
		super(label,layer);
	}

	/**
	 * Receive input signal and propagate activation to output synapses
	 * @param {float} signal 
	 */
	fire(signal) {
		this.signal = parseFloat(signal);
		this.activation = parseFloat(signal);
		for(let output of this.outputs) {
			output.fire(parseFloat(this.activation));
		}
	}

	/**
	 * Receive back propagated errors from output synapses and sum for error
	 * (This is more just for debugging/analysis - the error value is not actually used)
	 */
	backPropagate() {
		for(let output of this.outputs) {
			this.error += output.activation;
		}
	}

	mapActivation() {
		let signal = 0;
		for(let output of this.outputs) {
			signal += output.activation;
		}
		this.activation = signal;
	}
};

module.exports = Input;