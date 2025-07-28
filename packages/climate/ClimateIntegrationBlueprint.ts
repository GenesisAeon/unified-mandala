export function integrateSolarForcing(values: number[]): number {
  if (values.length === 0) return 0;
  const total = values.reduce((a, b) => a + b, 0);
  return total / values.length;
}
