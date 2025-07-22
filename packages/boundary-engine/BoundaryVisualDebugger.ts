export function debugBoundaries(boundaries: string[]): string {
  return boundaries.map(b => `debug:${b}`).join('|');
}
