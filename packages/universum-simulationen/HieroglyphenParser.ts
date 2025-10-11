export function parseGlyphs(input: string): string[] {
  return input
    .split(/\s+/)
    .map((g) => g.trim())
    .filter(Boolean);
}
