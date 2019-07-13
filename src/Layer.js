class Layer {

	/**
	 * Constructor for Network Layer
	 * @param {string} label 
	 */
	constructor(label,type) {
		this.label 	 = label; // Human readable label
		this.type 	 = type;
		this.neurons = []; 	  // Neurons contained in layer
	}

	static get INPUT() {
		return 0;
	}

	static get HIDDEN() {
		return 1;
	}

	static get OUTPUT() {
		return 2;
	}

	isInput() {
		return this.type === this.INPUT;
	}

	isHidden() {
		return this.type === this.HIDDEN;
	}

	isOutput() {
		return this.type === this.OUTPUT;
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

	toObject() {
		return {
			neurons: this.neurons.map(n => n.toObject())
		};
	}
};

module.exports = Layer;