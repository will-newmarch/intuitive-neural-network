class Activation {

    static calculate(activationType, derivative = false) {
        switch(activationType) {
            case 'sigmoid':
                if(!derivative)
                    return function(neuron) { return 1 / (1 + Math.exp(-neuron.signal)); };
                else
                    return function(val) { return val * (1 - val); };
            case 'leakyrelu':
                if(!derivative)
                    return function(neuron) { return neuron.signal > 0 ? neuron.signal : neuron.signal * 0.01; };
                else 
                    return function(val) { return val > 0 ? 1 : 0.01; };
            case 'relu':
                if(!derivative)
                    return function(neuron) { return neuron.signal > 0 ? neuron.signal : 0; };
                else
                    return function(val) { return val > 0 ? 1 : 0; };
            case 'tanh':
                if(!derivative)
                    return function(neuron) { return Math.tanh(neuron.signal); };
                else
                    return function(val) { return 1 - Math.pow(Math.tanh(val),2); };
            case 'linear','identity':
                if(!derivative)
                    return function(neuron) { return neuron.signal; };
                else
                    return function(val) { return val; };
            case 'heaviside':
                if(!derivative)
                    return function(neuron) { return !!(neuron.signal > 0) ? 1 : 0; };
                else
                    return function(val) { return !!(val > 0) ? 1 : 0; };
            case 'softmax':
                if(!derivative)
                    return function(neuron) { 
                        const allNeurons = neuron.layer.neurons;
                        let allActivations = 0;
                        for(let neuron of allNeurons) {
                            allActivations += Math.pow(Math.E,neuron.signal);
                        }                        
                        return Math.pow(Math.E,neuron.signal) / allActivations;
                    };
                else
                    return function(val) { return val * (1 - val); };
        }
    }
};

module.exports = Activation;