export interface CREPValues {
  C: number;
  R: number;
  E: number;
}

/**
 * Returns a color name based on CREP values using the phase matrix.
 * red = critical, green = safe, orange = warning
 */
export function getCREPPhaseColor({ C, R, E }: CREPValues): string {
  if (C < 4 || R < 4 || E < 4) return 'red';
  if (C >= 7 && R >= 7 && E >= 7) return 'green';
  return 'orange';
}
