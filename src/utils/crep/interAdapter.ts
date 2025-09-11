export function interAdapterResonance(a?: number, b?: number): number {
  const aN = typeof a === "number" ? a : 0;
  const bN = typeof b === "number" ? b : 0;
  return 1 - Math.min(1, Math.abs(aN - bN));
}
