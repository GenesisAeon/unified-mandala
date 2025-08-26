export class BayesDesigner {
  /**
   * Simple Bayesian update returning the posterior probability of a design
   * given a prior belief and evidence likelihood.
   */
  suggest(prior: number, evidence: number): number {
    const numerator = prior * evidence;
    const denominator = numerator + (1 - prior) * (1 - evidence);
    if (denominator === 0) return 0;
    return numerator / denominator;
  }
}

export default BayesDesigner;
