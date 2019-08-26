'use strict';

const Network = require('../src/Network.js');

test('cee loss function works correctly', () => {

    // Build the network...
    var network = new Network({
        layers: [3,2,2],
        hiddenActivationType: 'identity',
        outputActivationType: 'softmax',
        bias: true,
        loss: 'cee'
    });

    var data = [
        {x: [0,0,1], y: [0,1]},
        {x: [0,1,1], y: [1,0]},
        {x: [1,0,1], y: [1,0]},
        {x: [1,1,1], y: [0,1]}
    ];

    // Training the network...
    var epochs = 1000;
    var learningRate = 0.01;
    var errors = [];

    for (var h = 0; h < epochs; h++) {

        for (var i = 0; i < data.length; i++) {

            let index = Math.floor(Math.random() * data.length);
            
            network
                .fire(data[index].x)
                .backPropagate(data[index].y)
                .applyError(learningRate)
                .reset();

        }

        if(h % (epochs/10) === 0) {
            errors.push(network.test(data));
        }
    }
    // Done.

    network.visualiseErrors(errors);

    // Testing the trained network...
    for(var i = 0; i < data.length; i++) {

        network.fire(data[i].x);

        var activation = network.layers[network.layers.length-1].neurons.map(n => n.activation);

        // TODO
        //expect(Math.round(activation)).toBe(data[i].y[0]);

        network.reset();

    }
    // Done.

});
