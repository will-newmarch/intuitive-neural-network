const Input = require('./Input.js');

class Bias extends Input {
	
	/**
	 * Constructor for Bias Neuron
	 * @param {string} label 
	 */
	constructor(label,layer) {
		super(label,layer)
		this.activation = 1; // Hard code activation to 1
	}

	isBias() {
		return true;
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