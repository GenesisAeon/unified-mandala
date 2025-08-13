export class EmergencePredictorAgent {
  private history: number[];
  constructor(history: number[] = []) {
    this.history = history;
  }
  add(value: number) {
    this.history.push(value);
  }
  predict(): number {
    const n = this.history.length;
    if (n === 0) return 0;
    if (n === 1) return this.history[0];
    const x = this.history.map((_, i) => i + 1);
    const y = this.history;
    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (x[i] - xMean) * (y[i] - yMean);
      den += (x[i] - xMean) ** 2;
    }
    const slope = den === 0 ? 0 : num / den;
    const intercept = yMean - slope * xMean;
    return intercept + slope * (n + 1);
  }
}
