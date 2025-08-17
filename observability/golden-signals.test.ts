import { calculateGoldenSignals } from './golden-signals';

describe('calculateGoldenSignals', () => {
  it('computes metrics from inputs', () => {
    const latencies = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const metrics = calculateGoldenSignals(latencies, 90, 100, 5, 2);
    expect(metrics.p95Latency).toBeCloseTo(955, 5);
    expect(metrics.successRate).toBeCloseTo(0.9);
    expect(metrics.queueDepth).toBe(5);
    expect(metrics.retries).toBe(2);
  });

  it('handles empty inputs', () => {
    const metrics = calculateGoldenSignals([], 0, 0, 0, 0);
    expect(metrics.p95Latency).toBe(0);
    expect(metrics.successRate).toBe(0);
  });
});
