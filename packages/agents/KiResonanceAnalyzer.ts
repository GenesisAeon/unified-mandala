export interface ResonanceStats {
  average: number;
  min: number;
  max: number;
  variance: number;
}

export class KiResonanceAnalyzer {
  average(values: number[]): number {
    if (!values.length) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }

  analyze(values: number[]): ResonanceStats {
    const avg = this.average(values);
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;
    const variance = values.length
      ? values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length
      : 0;
    return { average: avg, min, max, variance };
  }
}
