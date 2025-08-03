import { runStressTest, tuneCREP } from './index';

describe('DeepScience experiment suite', () => {
  it('runs stress tests and returns maximum load', () => {
    const result = runStressTest([1, 5, 3]);
    expect(result.maxLoad).toBe(5);
  });

  it('tunes CREP scores with a ceiling of 1', () => {
    expect(tuneCREP(0.8)).toBeCloseTo(0.88);
    expect(tuneCREP(0.95)).toBe(1);
  });
});
