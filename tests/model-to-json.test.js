'use strict';

const Network = require('../src/Network.js');

test('library can convert a model to JSON', () => {

    // Build the network...
    var network = new Network({
        layers: [2,2,1],
        bias: false
    });

    // Hard-code weights to create exact JSON
    network.layers.map(l => {
        l.neurons.map(n => {
            n.outputs.map(o => {
                o.weight = 0.5;
            });
        });
    });

    const expectedJSON = '{"layers":[{"neurons":[{"type":"Input","label":"input-0","activationType":"sigmoid","outputs":[{"type":"Synapse","label":"input-0--hidden-0","inputLabel":"input-0","outputLabel":"hidden-0","weight":0.5},{"type":"Synapse","label":"input-0--hidden-1","inputLabel":"input-0","outputLabel":"hidden-1","weight":0.5}]},{"type":"Input","label":"input-1","activationType":"sigmoid","outputs":[{"type":"Synapse","label":"input-1--hidden-0","inputLabel":"input-1","outputLabel":"hidden-0","weight":0.5},{"type":"Synapse","label":"input-1--hidden-1","inputLabel":"input-1","outputLabel":"hidden-1","weight":0.5}]}]},{"neurons":[{"type":"Hidden","label":"hidden-0","activationType":"sigmoid","outputs":[{"type":"Synapse","label":"hidden-0--output-0","inputLabel":"hidden-0","outputLabel":"output-0","weight":0.5}]},{"type":"Hidden","label":"hidden-1","activationType":"sigmoid","outputs":[{"type":"Synapse","label":"hidden-1--output-0","inputLabel":"hidden-1","outputLabel":"output-0","weight":0.5}]}]},{"neurons":[{"type":"Output","label":"output-0","activationType":"identity","outputs":[]}]}]}';

    expect(network.toJSON()).toBe(expectedJSON);

});

