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
		for (var i = 0; i < this.outputs.length; i++) {
			this.outputs[i].fire(this.activation);
		}
	}
};

module.exports = Bias;