const Activation = require('./../Activation.js');

class Neuron {

	/**
	 * Constructor for Hidden Neuron
	 * @param {string} label 
	 */
	constructor(label) {
		this.label 			= label; 	 // Human readable label
		this.inputs 		= [];        // Reference to the input synapses
		this.inputSignals 	= [];        // Array to collect signals from inputs (when firing)
		this.outputs 		= [];    	 // Reference to the output synapses
		this.outputSignals 	= [];    	 // Array to collect signals FROM outputs (when backpropagating)
		this.activation 	= 0;     	 // Activation of the neuron
		this.error 			= 0;     	 // Error to be persisted (not actually used in Input neuron, more kept for interest)
		this.setActivationType('sigmoid'); // Neuron activation function (defaulting to sigmoid)
	}

	setActivationType(type) {
		this.activationType = type;
		this.activationFunc = Activation.calculate(this.activationType);
		this.derivativeFunc = Activation.calculate(this.activationType,true);
	}

	isBias() {
		return false;
	}

	/**
	 * Reset neuron to initial state
	 */
	reset() {
		this.activation 	= 0;
		this.error 			= 0;  
	}
	
	/**
	 * Receive input signal and propagate activation to output synapses
	 * @param {float} signal 
	 */
	fire(signal) {
		throw 'fire method must be overidden!';
	}

	/**
	 * Receive back propagated errors from output synapses and sum for error
	 * @param {float} backSignal 
	 */
	backPropagate(backSignal) {
		throw 'backPropagate method must be overidden!';
	}

	/**
	 * Uses activation maximisation to discover the path of activation 
	 * needed to activate this neuron to the supplied signal
	 * @param {float} signal
	 * @param {integer} count
	 */
	mapActivation(signal,count = null) {
		if(!this.hasOwnProperty('mappedSignals')) this.mappedSignals = [];
		this.mappedSignals.push(signal);
		if(count === null || this.mappedSignals.length === count) {	
			this.activation = this.mappedSignals.reduce((a,s) => a+s,0);
			const expectedCount = count === null ? 1 : this.outputs[0].output.inputs.length;
			for(let input of this.inputs) {
				const activation = this.activationFunc(this.activation);
				input.mapActivation(activation,expectedCount);
			}
			delete this.mappedSignals;
		}
	}

	backPropagate(backSignal) {
		this.outputSignals.push(backSignal);
		if(this.outputSignals.length == this.outputs.length) {
			const signal = this.outputSignals.reduce((a,s) => a+s,0);
			this.error = signal + this.derivativeFunc(this.activation);
			for (var i = 0; i < this.inputs.length; i++) {
				this.inputs[i].backPropagate(this.error);
			}
		}
	}

	toObject() {
		return {
			type: this.constructor.name,
			label: this.label,
			activationType: this.activationType,
			outputs: this.outputs.map(o => o.toObject())
		};
	}
};

module.exports = Neuron;