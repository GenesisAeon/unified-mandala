export function generatePatterns(data: number[]): number[] {
  const patterns: number[] = [];
  for (let i = 1; i < data.length; i++) {
    patterns.push(data[i] - data[i - 1]);
  }
  return patterns;
}
