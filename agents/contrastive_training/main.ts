/**
 * Contrastive training agent utilities.
 * Generates hallucination vs fact pairs with a simple contrast score.
 */

export interface ContrastivePair {
  hallucination: string;
  fact: string;
  /**
   * A naive contrast score based on length difference.
   */
  contrast: number;
}

/**
 * Create a contrastive pair with a computed score.
 */
export function createContrastivePair(hallucination: string, fact: string): ContrastivePair {
  const contrast = Math.abs(hallucination.length - fact.length);
  return { hallucination, fact, contrast };
}
