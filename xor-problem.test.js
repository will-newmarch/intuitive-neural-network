const Network = require('./src/Network.js');

test('library solves XOR problem', () => {

    console.time('XOR');

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
    for(var i = 0; i < data.length; i++) {

        network.fire(data[i].x);

        var activation = network.layers[network.layers.length-1].neurons[0].activation;

        expect(Math.round(activation)).toBe(data[i].y[0]);

        network.reset();

    }
    // Done.

    console.timeEnd('XOR');

});

