import { Network } from '../simple-neural-net';
import { crepLearningFactor, CREPSignature } from './crepAdapter';

/**
 * Trainingsschritt, der Mutation mit einem Lernfaktor kombiniert.
 */
export function selfTrain(
  net: Network,
  data: [number, number][],
  answers: number[],
  crep: CREPSignature,
  epochs = 10,
) {
  const rate = crepLearningFactor(crep);
  for (let i = 0; i < epochs; i++) {
    net.train(data, answers, 1);
    // einfache Backprop-Näherung: leichtes Nachjustieren zur Mitte
    const preds = data.map((d) => net.predict(d[0], d[1]));
    const neurons = net.neurons as any[];
    for (const n of neurons) {
      n.weight1 -= rate * (preds[0] - answers[0]) * data[0][0];
      (n as any).weight2 -= rate * (preds[0] - answers[0]) * data[0][1];
    }
  }
}
