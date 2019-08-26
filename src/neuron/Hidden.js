const Neuron = require('./Neuron.js');

class Hidden extends Neuron {

	/**
	 * Constructor for Hidden Neuron
	 * @param {string} label 
	 */
	constructor(label,layer) {
		super(label,layer);
	}
};

module.exports = Hidden;