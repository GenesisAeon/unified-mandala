import { Network } from '../simple-neural-net';

/**
 * Summiert absolute Gewichte aller Neuronen als einfache Energie-Messung.
 */
export function scanEnergy(net: Network): number {
  const neurons = (net as any).neurons as any[];
  let sum = 0;
  for (const n of neurons) {
    sum += Math.abs(n.weight1);
    sum += Math.abs((n as any).weight2);
  }
  return sum;
}
