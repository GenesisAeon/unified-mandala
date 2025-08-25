export interface SecureAggregatorOptions {
  /**
   * Epsilon parameter for Laplace mechanism. If 0, no noise is added.
   */
  epsilon?: number;
}

/**
 * SecureAggregator averages numeric vectors and can add
 * differential privacy noise to the result.
 */
export class SecureAggregator {
  private updates: number[][] = [];
  constructor(private opts: SecureAggregatorOptions = {}) {}

  addUpdate(vec: number[]): void {
    this.updates.push(vec);
  }

  aggregate(): number[] {
    if (this.updates.length === 0) return [];
    const length = this.updates[0].length;
    const sum = new Array<number>(length).fill(0);
    for (const vec of this.updates) {
      for (let i = 0; i < length; i++) {
        sum[i] += vec[i];
      }
    }
    let avg = sum.map((s) => s / this.updates.length);
    if (this.opts.epsilon && this.opts.epsilon > 0) {
      avg = avg.map((v) => v + this.laplace(this.opts.epsilon!));
    }
    return avg;
  }

  clear(): void {
    this.updates = [];
  }

  private laplace(epsilon: number): number {
    const u = Math.random() - 0.5;
    return -Math.sign(u) * Math.log(1 - 2 * Math.abs(u)) / epsilon;
  }
}
