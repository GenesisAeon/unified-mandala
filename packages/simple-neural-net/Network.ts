import { Neuron } from './Neuron';
import { sigmoid, meanSquareLoss } from './util';

export class Network {
  private _neurons: Neuron[] = [
    new Neuron(),
    new Neuron(),
    new Neuron(), // input
    new Neuron(),
    new Neuron(), // hidden
    new Neuron(), // output
  ];

  /** Access internal neurons array for advanced inspection. */
  get neurons(): Neuron[] {
    return this._neurons;
  }

  predict(input1: number, input2: number): number {
    const n = this._neurons;
    return n[5].compute(
      n[4].compute(
        n[2].compute(input1, input2, sigmoid),
        n[1].compute(input1, input2, sigmoid),
        sigmoid,
      ),
      n[3].compute(
        n[1].compute(input1, input2, sigmoid),
        n[0].compute(input1, input2, sigmoid),
        sigmoid,
      ),
      sigmoid,
    );
  }

  train(data: [number, number][], answers: number[], epochs = 1000) {
    let bestLoss: number | null = null;
    for (let epoch = 0; epoch < epochs; epoch++) {
      const neuron = this._neurons[epoch % this._neurons.length];
      neuron.mutate();

      const predictions = data.map((d) => this.predict(d[0], d[1]));
      const loss = meanSquareLoss(answers, predictions);

      if (bestLoss === null || loss < bestLoss) {
        bestLoss = loss;
        neuron.remember();
      } else {
        neuron.forget();
      }
    }
  }
}
