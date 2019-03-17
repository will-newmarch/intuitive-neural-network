# Intuitive Neural Network
### When you would like to understand what's going on without the mathematics!
A JavaScript based, object-orientated approach to a Neural Network library.

The two aims behind creating this library are:
1. **Intuition** - To create a neural network library that is intuitive, breaking away from the mathematical representations of neural networks, and allowing them to be represented as an actual 'network' of neurons firing down synapses and activating one-another.
2. **Built with JavaScript** - More accessable. JavaScript copes well with running neural networks, even with a less mathematical, more object-orientated approach.

---

Run the XOR example with `npm test`

---

## A Simple Implementation (XOR Problem)

    // Build the network...
    var network = new Network({
        layers: [2,2,1],
        bias: false
    });

    // Training data (x in, y out)
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

        // expect Math.round(activation) to equal data[i].y[0]

        network.reset();

    }
    // Done.

---


<a name="Network"></a>

## Network
**Kind**: global class  

* [Network](#Network)
    * [new Network(settings)](#new_Network_new)
    * [.fire(signals)](#Network+fire) ⇒
    * [.backPropagate(errors)](#Network+backPropagate) ⇒
    * [.applyError(learningRate)](#Network+applyError) ⇒
    * [.reset()](#Network+reset) ⇒

<a name="new_Network_new"></a>

### new Network(settings)
Constructor for Network


| Param | Type |
| --- | --- |
| settings | <code>object</code> | 

<a name="Network+fire"></a>

### network.fire(signals) ⇒
Fire the input layer's Neurons with supplied array of floats

**Kind**: instance method of [<code>Network</code>](#Network)  
**Returns**: Network (for chaining purposes)  

| Param | Type |
| --- | --- |
| signals | <code>array</code> | 

<a name="Network+backPropagate"></a>

### network.backPropagate(errors) ⇒
Initialise back propagation through network with supplied array of floats

**Kind**: instance method of [<code>Network</code>](#Network)  
**Returns**: Network (for chaining purposes)  

| Param | Type |
| --- | --- |
| errors | <code>array</code> | 

<a name="Network+applyError"></a>

### network.applyError(learningRate) ⇒
Trigger each synapse to apply its error to its weight

**Kind**: instance method of [<code>Network</code>](#Network)  
**Returns**: Network (for chaining purposes)  

| Param | Type |
| --- | --- |
| learningRate | <code>float</code> | 

<a name="Network+reset"></a>

### network.reset() ⇒
Reset all the Neurons and Synapses back to their initial state

**Kind**: instance method of [<code>Network</code>](#Network)  
**Returns**: Network (for chaining purposes)  