export class ResonanzMetrics {
  private samples: number[] = [];

  addSample(value: number): void {
    this.samples.push(value);
  }

  average(): number {
    if (this.samples.length === 0) return 0;
    const sum = this.samples.reduce((a, b) => a + b, 0);
    return sum / this.samples.length;
  }

  max(): number {
    return this.samples.length ? Math.max(...this.samples) : 0;
  }
}
