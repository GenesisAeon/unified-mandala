export interface ExperimentResult<T> {
  params: T;
  score: number;
}

/**
 * AutoTuningAgent searches a parameter space while respecting a budget
 * and logging each experiment result.
 */
export class AutoTuningAgent<T> {
  constructor(
    private budget: number,
    private logger: (result: ExperimentResult<T>) => void = () => {},
  ) {}

  /**
   * Explore the provided parameter candidates using the evaluation
   * function until the budget is exhausted. Returns the best experiment
   * result or null if no candidates are evaluated.
   */
  async tune(
    candidates: T[],
    evaluate: (params: T) => Promise<number> | number,
  ): Promise<ExperimentResult<T> | null> {
    let remaining = this.budget;
    let best: ExperimentResult<T> | null = null;

    for (const params of candidates) {
      if (remaining <= 0) break;
      const score = await evaluate(params);
      const result = { params, score };
      this.logger(result);
      if (!best || score > best.score) {
        best = result;
      }
      remaining -= 1;
    }

    return best;
  }
}

export default AutoTuningAgent;
