const Network = require('./src/Network.js');
const mnist = require('mnist');

let average = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
function getAverage(val) {
    average.pop();
    average.unshift(val);
    return average.reduce((a,v) => a+Math.abs(v),0) / average.length;
}

test('library solves MNIST problem', () => {

    console.time('MNIST');

    // Build the network...
    const network = new Network({
        layers: [784,128,64,10],
        hiddenActivationType: 'relu',
        outputActivationType: 'sigmoid',
        bias: true
    });

    const set = mnist.set(6000,1000);

    const trainingSet = set.training.map((s) => {
        return {
            input:  new Float32Array(s.input),
            output: new Float32Array(s.output)
        };
    });
    const testSet = set.test.map((s) => {
        return {
            input:  new Float32Array(s.input),
            output: new Float32Array(s.output)
        };
    });

    // Training the network...
    const epochs = 20;
    const learningRate = 0.1;
    const lossThreshold = 0.003;

    epochLoop: for (let h = 0; h < epochs; h++) {

        trainingLoop: for (let i = 0; i < trainingSet.length; i++) {

            let index = Math.floor(Math.random() * trainingSet.length);
            
            network
                .fire(trainingSet[index].input)
                .backPropagate(trainingSet[index].output);

            const loss = getAverage(network.loss());

            network
                .applyError(learningRate)
                .reset();

            if(loss < lossThreshold) break epochLoop;

        }
    }
    // Done.

    // Testing the trained network...
    let accuracy = 0;
    for(let i = 0; i < testSet.length; i++) {

        network.fire(testSet[i].input);

        const activation = network.layers[network.layers.length-1].neurons.map(n => n.activation);
        
        const prediction = activation.map(n => Math.abs(Math.round(n)));
        
        accuracy += ~~(prediction.toString() == testSet[i].output.toString());

        expect(accuracy > 900).toBe(true);

        network.reset();

    }
    // Done.

    console.timeEnd('MNIST');

});
