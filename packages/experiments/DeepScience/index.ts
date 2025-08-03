export interface StressTestResult {
  maxLoad: number;
}

/**
 * runStressTest measures the maximum load from a set of samples.
 * It acts as a simple placeholder for more advanced stress experiments.
 */
export function runStressTest(samples: number[]): StressTestResult {
  return { maxLoad: samples.length ? Math.max(...samples) : 0 };
}

/**
 * tuneCREP applies a tuning factor to a CREP score and caps the result at 1.
 */
export function tuneCREP(score: number, factor = 1.1): number {
  const tuned = score * factor;
  return tuned > 1 ? 1 : tuned;
}
