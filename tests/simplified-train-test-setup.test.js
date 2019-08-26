'use strict';

const Network = require('../src/Network.js');

test('simplified usage works correctly', () => {

    // Build the network...
    var network = new Network({
        layers: [2,2,1],
        bias: false,
        loss: 'mse'
    });

    var data = [
        {x: [0,0], y: [0]},
        {x: [0,1], y: [1]},
        {x: [1,0], y: [1]},
        {x: [1,1], y: [0]}
    ];

    network.train(data,0.01);
    const mse = network.test(data);

    expect(mse > 0).toBe(true);

});

