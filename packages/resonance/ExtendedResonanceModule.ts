export class ExtendedResonanceModule {
  modulate(value: number): number {
    return value * 1.5;
  }

  analyzeAmplitude(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.max(...values) - Math.min(...values);
  }

  analyzePhase(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }
}
