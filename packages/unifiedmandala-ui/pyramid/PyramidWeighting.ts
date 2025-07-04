export const PHI = (1 + Math.sqrt(5)) / 2;

export function generateWeights(totalLayers: number): number[] {
  const weights: number[] = [];
  const factor = Math.PI / Math.E;
  for (let i = 0; i < totalLayers; i++) {
    const weight = Math.pow(PHI, i) / factor;
    weights.push(Number(weight.toFixed(6)));
  }
  return weights;
}
