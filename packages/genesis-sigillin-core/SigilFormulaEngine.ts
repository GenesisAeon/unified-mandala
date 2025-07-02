export function extractKeywords(formula: string): string[] {
  return formula
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}
