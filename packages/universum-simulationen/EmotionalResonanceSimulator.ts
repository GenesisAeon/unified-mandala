export interface ResonanceResult {
  average: number;
  state: 'positive' | 'neutral' | 'negative';
}

/**
 * Calculate the average resonance value and classify it into a simple
 * emotional state. Values greater than 0.5 are considered positive,
 * values lower than -0.5 negative, the rest neutral.
 */
export function simulateResonance(values: number[]): ResonanceResult {
  if (values.length === 0) {
    return { average: 0, state: 'neutral' };
  }

  const average = values.reduce((a, b) => a + b, 0) / values.length;
  let state: ResonanceResult['state'];

  if (average > 0.5) {
    state = 'positive';
  } else if (average < -0.5) {
    state = 'negative';
  } else {
    state = 'neutral';
  }

  return { average, state };
}
