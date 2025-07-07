export function fractalDecompose(value: number): number[] {
  return value === 0 ? [] : [value / 2, value / 2];
}

export function computeFractalMetric(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / (values.length || 1);
}
