export function detectBoundary(rules: string[], text: string): string[] {
  return rules.filter(rule => text.includes(rule));
}
