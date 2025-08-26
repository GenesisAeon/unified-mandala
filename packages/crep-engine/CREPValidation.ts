export interface CREPScore {
  C: number;
  R: number;
  E: number;
  P: number;
}

/**
 * Validates that all CREP score components are within the inclusive range 0-10.
 */
export function validateCREP(score: CREPScore): boolean {
  const values = [score.C, score.R, score.E, score.P];
  return values.every((v) => v >= 0 && v <= 10);
}
