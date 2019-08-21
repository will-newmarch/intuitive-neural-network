'use strict';

const Network = require('../src/Network.js');

test('library maps activation', () => {

    // Build the network...
    var network = new Network({
        layers: [3,32,3],
        bias: false
    });

    var data = [
        {x: [0,0,1], y: [1,0,0]},
        {x: [1,0,0], y: [0,1,0]},
        {x: [0,1,0], y: [0,0,1]}
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
    data[0].y.map((v,i) => {

        network.layers[network.layers.length-1].neurons[i].mapActivation(1);

        expect(network.normaliseInputActivation()[0].map(v => Math.round(v))).toEqual(data[i].x);
    
        network.reset();

    });
    // Done.

});

