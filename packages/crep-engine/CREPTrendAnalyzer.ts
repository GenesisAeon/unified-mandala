export function analyzeTrend(values: number[]): number {
  if (values.length < 2) return 0;

  const n = values.length;
  const meanX = (n - 1) / 2;
  const meanY = values.reduce((sum, v) => sum + v, 0) / n;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    const dx = i - meanX;
    const dy = values[i] - meanY;
    numerator += dx * dy;
    denominator += dx * dx;
  }

  return denominator === 0 ? 0 : numerator / denominator;
}

export function classifyTrend(values: number[], epsilon = 1e-3): 'upward' | 'downward' | 'stable' {
  const slope = analyzeTrend(values);
  if (slope > epsilon) return 'upward';
  if (slope < -epsilon) return 'downward';
  return 'stable';
}
