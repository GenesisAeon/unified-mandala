export class SecureAggregator {
  constructor(private noiseStdDev = 0) {}

  aggregate(vectors: number[][]): number[] {
    if (vectors.length === 0) {
      return [];
    }
    const dim = vectors[0].length;
    const sum = new Array(dim).fill(0);
    for (const vec of vectors) {
      if (vec.length !== dim) {
        throw new Error('Vector length mismatch');
      }
      for (let i = 0; i < dim; i++) {
        sum[i] += vec[i];
      }
    }
    const avg = sum.map(s => s / vectors.length);
    return avg.map(v => v + this.noiseStdDev * gaussianRandom());
  }
}

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
