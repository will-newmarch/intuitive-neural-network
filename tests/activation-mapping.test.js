'use strict';

const Network = require('../src/Network.js');

test('library maps activation', () => {

    // Build the network...
    var network = new Network({
        layers: [2,1],
        bias: false
    });

    var data = [
        {x: [1,0], y: [1]},
        {x: [1,1], y: [3]}
    ];

    // Training the network...
    var epochs = 10000;
    var learningRate = 0.01;

    for (var h = 0; h < epochs; h++) {

        for (var i = 0; i < data.length; i++) {

            let index = Math.floor(Math.random() * data.length);
            
            network
                .fire(data[index].x)
                .backPropagate(data[index].y)
                .applyError(learningRate)
                .reset();

        }
    }
    // Done.

    // Testing the trained network...
    network.layers[network.layers.length-1].neurons[0].mapActivation([1]);

    expect(Math.round(network.layers[0].neurons[0].activation)).toBe(1);
    expect(Math.round(network.layers[0].neurons[1].activation)).toBe(2);
    // Done.

});

