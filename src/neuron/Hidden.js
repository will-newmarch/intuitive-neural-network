const Activation = require('./../Activation.js');
const Neuron 	 = require('./Neuron.js');

class Hidden extends Neuron {

	/**
	 * Constructor for Hidden Neuron
	 * @param {string} label 
	 */
	constructor(label) {
		super(label);

		this.inputs 		= [];        // Reference to the input synapses
		this.inputSignals 	= [];        // Array to collect signals from inputs (when firing)
		this.outputs 		= [];    	 // Reference to the output synapses
		this.outputSignals 	= [];    	 // Array to collect signals FROM outputs (when backpropagating)
		this.activation 	= 0;     	 // Activation of the neuron
		this.error 			= 0;     	 // Error to be persisted (not actually used in Input neuron, more kept for interest)
	}

	/**
	 * Reset neuron to initial state
	 */
	reset() {
		this.inputSignals 	= [];
		this.outputSignals 	= [];
		this.activation 	= 0;
		this.error 			= 0;  
	}
	
	/**
	 * Receive input signal and propagate activation to output synapses
	 * @param {float} signal 
	 */
	fire(signal) {
		this.inputSignals.push(parseFloat(signal));
		if(this.inputSignals.length == this.inputs.length) {
			const signal = this.inputSignals.reduce((a,s) => a+s,0);
			this.activation = this.activationFunc(signal);
			for (var i = 0; i < this.outputs.length; i++) {
				this.outputs[i].fire(this.activation);
			}
		}
	}

	/**
	 * Receive back propagated errors from output synapses and sum for error
	 * @param {float} backSignal 
	 */
	backPropagate(backSignal) {
		this.outputSignals.push(parseFloat(backSignal));
		if(this.outputSignals.length == this.outputs.length) {
			const signal = this.outputSignals.reduce((a,s) => a+s,0);
			this.error = signal + this.derivativeFunc(this.activation);
			for (var i = 0; i < this.inputs.length; i++) {
				this.inputs[i].backPropagate(this.error);
			}
		}
	}
};

module.exports = Hidden;