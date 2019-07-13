'use strict';

const fs = require('fs');

const Network = require('../src/Network.js');

test('library can save model to file', (done) => {

    // Build the network...
    var network = new Network({
        layers: [2,2,1],
        bias: false
    });

    const filename = './temp.json';

    // Test this runs without callback
    network.save(filename);

    // Test this runs with callback
    network.save(filename,() => {

        expect(fs.existsSync(filename)).toBe(true);

        fs.unlinkSync(filename);

        done();

    });

});

