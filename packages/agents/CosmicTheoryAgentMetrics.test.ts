import { describe, it, expect, vi } from 'vitest';
import { CosmicTheoryAgentMetrics } from './CosmicTheoryAgentMetrics';

describe('CosmicTheoryAgentMetrics', () => {
  it('records and queries metrics', () => {
    const metrics = new CosmicTheoryAgentMetrics();
    metrics.record('latency', 5);
    metrics.record('latency', 7);
    metrics.record('throughput', 10);
    const lat = metrics.query('latency');
    expect(lat.length).toBe(2);
    const all = metrics.query();
    expect(all.length).toBe(3);
  });

  it('clears metrics', () => {
    const metrics = new CosmicTheoryAgentMetrics();
    metrics.record('x', 1);
    metrics.clear();
    expect(metrics.query().length).toBe(0);
  });
});
