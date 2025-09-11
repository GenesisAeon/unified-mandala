export function interAdapterResonance(a: number, b: number): number {
  const d = Math.abs((a ?? 0) - (b ?? 0));
  return Math.max(0, 1 - Math.min(1, d));
}
