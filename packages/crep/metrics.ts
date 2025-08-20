export interface CREPEvaluation {
  C: number;
  R: number;
  E: number;
  P: number;
  hopeActivation: number;
}

/**
 * Computes overall CREP score including hope activation.
 */
export function evaluateCREP(metrics: CREPEvaluation): number {
  const { C, R, E, P, hopeActivation } = metrics;
  const values = [C, R, E, P, hopeActivation];
  const total = values.reduce((a, b) => a + b, 0);
  return total / values.length;
}
