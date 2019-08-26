const Neuron = require('./Neuron.js');

class Output extends Neuron {

    /**
	 * Constructor for Output Neuron
	 * @param {string} label 
	 */
	constructor(label,layer) {
		super(label,layer);
    }
    
    /**
	 * Receive back propagated errors from output synapses and sum for error 
     * before back propagating this to inputs
	 * @param {float} backSignal 
	 */
	backPropagate(backSignal) {
		this.error = backSignal; //this.activation - backSignal;
        for(let input of this.inputs) {
            input.backPropagate(this.error);
        }
	}
};

module.exports = Output;