class Synapse {

	/**
	 * Constructor for Synapse
	 * @param {Neuron} input 
	 * @param {Neuron} output 
	 */
	constructor(input,output) {
		this.label = input.label + '--' + output.label; // Human readable label
		this.input = input; 							// Input Neuron
		this.output = output; 							// Output Neuron
		this.weight = (Math.random() * 2) - 1; 			// Initial weight
		this.signal = 0; 								// Input signal
		this.error = 0; 								// Calculated error
	}

	/**
	 * Reset synapse to initial state
	 */
	reset() {
		this.signal = 0;
		this.error = 0;
	}

	/**
	 * Receive input signal and fire to output Neuron
	 * @param {float} signal 
	 */
	fire(signal) {
		this.signal = signal;
		this.output.fire(signal * this.weight);
	}

	/**
	 * Receive error, calcuate responsibility and back propagate
	 * @param {float} error 
	 */
	backPropagate(error) {
		this.error = error * this.signal;
		this.input.backPropagate(error * this.weight);
	}

	/**
	 * Apply the error to the weight to correct
	 * @param {float} learningRate 
	 */
	applyError(learningRate) {
		this.weight -= learningRate * this.error;
	}
};

module.exports = Synapse;