export function optimizeThreshold(
  values: number[],
  current: number,
  learningRate = 0.1
): number {
  if (values.length === 0) return current;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const updated = current + (avg - current) * learningRate;
  return Math.min(1, Math.max(0, updated));
}
