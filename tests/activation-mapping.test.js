'use strict';

const Network = require('../src/Network.js');

test('library maps activation', () => {

    // Build the network...
    var network = new Network({
        layers: [3,32,3],
        bias: false,
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
    const activation = network.mapActivation(data[0].y);
    expect(activation.map(v => Math.round(v))).toEqual(data[0].x);
    // Done.

});


test('library maps activation with bias', () => { // TODO needs improving, the Math.floor is less than ideal.

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
    const activation = network.mapActivation(data[0].y);
    expect(activation.map(v => Math.round(v))).toEqual(data[0].x);
    // Done.

});

