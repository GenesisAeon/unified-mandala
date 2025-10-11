# Simple Neural Net

This package implements a minimal neural network as described in the tutorial. It uses a small set of `Neuron` instances organised into a `Network` with a feed forward prediction pipeline and a mutation based training loop.

## Usage

```ts
import { Network } from 'simple-neural-net';

const data = [
  [115, 66],
  [175, 78],
  [205, 72],
  [120, 67],
];
const answers = [1, 0, 0, 1];

const net = new Network();
net.train(data, answers);

console.log(net.predict(130, 66));
```
