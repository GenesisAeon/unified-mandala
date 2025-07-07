export function symbolicRegression(samples: number[]): string {
  if (samples.length === 0) return '0';
  const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
  return `y = ${avg.toFixed(1)}`;
}
