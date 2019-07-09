class Activation {

    static calculate(activationType, derivative = false) {
        switch(activationType) {
            case 'sigmoid':
                if(!derivative)
                    return function(val) { return 1 / (1 + Math.exp(-val)); };
                else
                    return function(val) { return val * (1 - val); };
            case 'leakyrelu':
                if(!derivative)
                    return function(val) { return val > 0 ? val : val * 0.01; };
                else 
                    return function(val) { return val > 0 ? 1 : 0.01; };
            case 'relu':
                if(!derivative)
                    return function(val) { return val > 0 ? val : 0; };
                else
                    return function(val) { return val > 0 ? 1 : 0; };
            case 'tanh':
                if(!derivative)
                    return function(val) { return Math.tanh(val); };
                else
                    return function(val) { return 1 - Math.pow(Math.tanh(val),2); };
            case 'linear','identity':
                if(!derivative)
                    return function(val) { return val; };
                else
                    return function(val) { return val; };
            case 'heaviside':
                if(!derivative)
                    return function(val) { return !!(val > 0) ? 1 : 0; };
                else
                    return function(val) { return !!(val > 0) ? 1 : 0; };
        }
    }
};

module.exports = Activation;