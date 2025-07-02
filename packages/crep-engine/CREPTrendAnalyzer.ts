export function analyzeTrend(values: number[]): number {
  if (values.length < 2) return 0;
  const diff = values[values.length - 1] - values[0];
  return diff / (values.length - 1);
}
