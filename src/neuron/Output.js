const Activation = require('./../Activation.js');
const Neuron 	 = require('./Neuron.js');

class Output extends Neuron {

    /**
	 * Constructor for Output Neuron
	 * @param {string} label 
	 */
	constructor(label) {
		super(label);
    }
    
    /**
	 * Reset neuron to initial state
	 */
	reset() {
		this.inputSignals = [];
		this.activation   = 0;
		this.error        = 0;
    }
    
    /**
	 * Receive input signal and propagate activation to output synapses
	 * @param {float} signal 
	 */
	fire(signal) {
		this.inputSignals.push(signal);
		if(this.inputSignals.length == this.inputs.length) {
			const signal = this.inputSignals.reduce((a,s) => a+s,0);
			this.activation = this.activationFunc(signal);
		}
    }
    
    /**
	 * Receive back propagated errors from output synapses and sum for error 
     * before back propagating this to inputs
	 * @param {float} backSignal 
	 */
	backPropagate(backSignal) {
		this.error = this.activation - backSignal;
        for (var i = 0; i < this.inputs.length; i++) {
            this.inputs[i].backPropagate(this.error);
        }
	}
};

module.exports = Output;