import { describe, it, expect } from 'vitest';
import { ResonanceFeedbackModule } from './ResonanceFeedbackModule';

describe('ResonanceFeedbackModule', () => {
  it('calculates average and variance', () => {
    const mod = new ResonanceFeedbackModule();
    mod.add(1);
    mod.add(3);
    const metrics = mod.metrics();
    expect(metrics.average).toBe(2);
    expect(metrics.variance).toBe(1);
  });
});
