'use strict';

const Ervy = require('ervy');

const Network = require('../src/Network.js');

test('mse decreases over time', () => {

    // Build the network...
    var network = new Network({
        layers: [2,2,1],
        bias: false
    });

    var data = [
        {x: [0,0], y: [0]},
        {x: [0,1], y: [1]},
        {x: [1,0], y: [1]},
        {x: [1,1], y: [0]}
    ];

    const params = {
        epochs       : 10000,
        learningRate : 0.01
    };
    
    let MSEs = [];

    for(let i = 0; i < 10; i++) {
        network.train(data,params);
        MSEs.push(network.test(data));
    }

    const sortedMSEs = MSEs.sort().reverse();

    // MSEs should stay in the same order
    expect(JSON.stringify(MSEs)).toBe(JSON.stringify(sortedMSEs));
    
    // Nice little graphic!
    network.visualiseMSEs(MSEs);

});

