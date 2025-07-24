export function discoverPatterns(rules: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of rules) {
    counts[r] = (counts[r] || 0) + 1;
  }
  return counts;
}
