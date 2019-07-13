const Input = require('./Input.js');

class Bias extends Input {
	
	/**
	 * Constructor for Bias Neuron
	 * @param {string} label 
	 */
	constructor(label) {
		super(label)
		this.activation = 1; // Hard code activation to 1
	}

	isBias() {
		return true;
	}

	/**
	 * Reset neuron to initial state
	 */
	reset() {
		this.outputSignals 	= [];
		this.error 			= 0;  
	}

	/**
	 * Simply fire 1 down every output
	 */
	fire() {
		for (var i = 0, len = this.outputs.length; i < len; i++) {
			this.outputs[i].fire(this.activation);
		}
	}
};

module.exports = Bias;