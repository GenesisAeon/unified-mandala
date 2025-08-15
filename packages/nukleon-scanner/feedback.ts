const PHI = (1 + Math.sqrt(5)) / 2;

/**
 * Adjust weights using a phi-based spiral gradient.
 * Each subsequent weight is scaled by PHI^index to
 * emulate a spiraling amplification.
 */
export function phiGradientFeedback(weights: number[]): number[] {
  return weights.map((w, i) => w * Math.pow(PHI, i));
}

export default phiGradientFeedback;
