'use strict';

const fs = require('fs');

const Network = require('../src/Network.js');

test('library can convert a model to JSON', (done) => {

    // Build the network...
    var network = new Network({
        layers: [2,2,1],
        bias: false
    });

    const filename = './temp.json';

    network.save(filename,() => {

        expect(fs.existsSync(filename)).toBe(true);

        fs.unlinkSync(filename);

        done();

    });

});

