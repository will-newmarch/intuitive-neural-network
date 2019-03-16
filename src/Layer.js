class Layer {

	/**
	 * Constructor for Network Layer
	 * @param {string} label 
	 */
	constructor(label) {
		this.label 	 = label; // Human readable label
		this.neurons = []; 	  // Neurons contained in layer
	}

	/**
	 * Sum the total error of the layer
	 */
	error() {
		let totalError = 0;
		for (var j = 0; j < this.neurons.length; j++) {
			totalError += this.neurons[j].error;
		}
		return totalError;
	}
};

module.exports = Layer;