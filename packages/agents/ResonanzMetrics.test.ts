import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ResonanzMetrics } from './ResonanzMetrics';

describe('ResonanzMetrics', () => {
  it('calculates average and max', () => {
    const metrics = new ResonanzMetrics();
    metrics.addSample(3);
    metrics.addSample(7);
    expect(metrics.average()).toBe(5);
    expect(metrics.max()).toBe(7);
  });
});
