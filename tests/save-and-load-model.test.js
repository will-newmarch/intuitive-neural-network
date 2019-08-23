'use strict';

const Network = require('../src/Network.js');

test('library can save model to file and then load from a file', () => {

    // Build the network...
    const network1 = new Network({
        layers: [4,3,2],
        bias: true
    });

    const filename = './temp.json';

    network1.saveSync(filename);

    const network2 = new Network();
    network2.loadSync(filename);

    expect(network1.toJSON()).toEqual(network2.toJSON());

    const data = [1,2,3,4];

    network1.fire(data);
    network2.fire(data);

    const activation1 = network1.layers[network1.layers.length-1].neurons.map(n => n.activation);
    const activation2 = network2.layers[network2.layers.length-1].neurons.map(n => n.activation);
    
    expect(activation1).toEqual(activation2);

});

