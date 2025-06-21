export class KiResonanceAnalyzer {
  average(values: number[]): number {
    if (!values.length) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }
}
