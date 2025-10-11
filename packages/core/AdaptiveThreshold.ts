export class AdaptiveThreshold {
  constructor(
    private windowSize = 10,
    private k = 1.0,
  ) {}
  private history: number[] = [];

  push(value: number) {
    this.history.push(value);
    if (this.history.length > this.windowSize) this.history.shift();
  }

  getThreshold(): number {
    const vals = [...this.history];
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
    const std = Math.sqrt(variance);
    return mean + std * this.k;
  }
}
