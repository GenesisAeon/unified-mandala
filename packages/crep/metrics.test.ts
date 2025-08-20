import { evaluateCREP, CREPEvaluation } from './metrics';

describe('evaluateCREP', () => {
  it('includes hopeActivation in average', () => {
    const metrics: CREPEvaluation = { C: 1, R: 1, E: 1, P: 1, hopeActivation: 5 };
    const score = evaluateCREP(metrics);
    expect(score).toBeCloseTo(1.8);
  });
});
