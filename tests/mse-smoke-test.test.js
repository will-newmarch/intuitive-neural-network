'use strict';

const Ervy = require('ervy');

const Network = require('../src/Network.js');

test('mse decreases over time', () => {

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
    
    const epochs = 10;

    let errors = [];
    for(let i = 0; i < epochs; i++) {
        network.train(data,0.01);
        errors.push(network.test(data));
    }

    const sortedErrors = errors.sort().reverse();

    // Errors should stay in the same order
    expect(JSON.stringify(errors)).toBe(JSON.stringify(sortedErrors));
    
    // Nice little graphic!
    network.visualiseErrors(errors);

});

