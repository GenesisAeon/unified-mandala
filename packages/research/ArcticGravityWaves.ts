export function analyzeWaves(data: number[]): number {
  return data.reduce((a, b) => a + b, 0) / data.length;
}
