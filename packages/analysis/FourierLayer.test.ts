import { describe, it, expect } from 'vitest';
import { FourierLayer } from './FourierLayer';

describe('FourierLayer', () => {
  it('computes amplitude metrics', () => {
    const layer = new FourierLayer('L1', 1, [1, 0, -1, 0], { depth: 1 });
    const metrics = layer.analyze();
    expect(metrics.maxAmplitude).toBeGreaterThan(0);
    expect(metrics.avgAmplitude).toBeGreaterThan(0);
  });
});
