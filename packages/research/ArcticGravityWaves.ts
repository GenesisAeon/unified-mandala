export function analyzeWaves(data: number[]): number {
  return data.reduce((a, b) => a + b, 0) / data.length;
}

export function estimateAmplitude(data: number[]): number {
  const mean = analyzeWaves(data);
  const variance = data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / data.length;
  return Math.sqrt(variance);
}
