import { NeuronMembrane } from './neuronMembrane';

/**
 * Synchronisiert alle Netzebenen grob, indem die mittlere Vorhersage
 * der ersten Ebene mit allen anderen trainiert wird.
 */
export function depthSync(mem: NeuronMembrane, data: [number, number][]) {
  if (mem.depth < 2) return;
  const base = mem.getNetworks()[0];
  const target = data.map(d => base.predict(d[0], d[1]));
  for (let i = 1; i < mem.depth; i++) {
    mem.getNetworks()[i].train(data, target.map(t => Math.round(t)), 5);
  }
}
