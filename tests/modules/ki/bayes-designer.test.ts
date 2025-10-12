import { describe, it, expect } from 'vitest';
import { BayesDesigner } from '../../../src/modules/ki/BayesDesigner';

describe('BayesDesigner', () => {
  it('computes posterior with simple update', () => {
    const d = new BayesDesigner();
    const p = d.suggest(0.5, 0.8);
    // numerator=0.4, denominator=0.4 + 0.1 = 0.5 => 0.8
    expect(p).toBeCloseTo(0.8, 6);
  });

  it('returns 0 when denominator is 0', () => {
    const d = new BayesDesigner();
    // prior=1, evidence=0 yields denom 0
    expect(d.suggest(1, 0)).toBe(0);
  });
});
