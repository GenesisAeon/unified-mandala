import { describe, it, expect } from 'vitest';
import { calculateMetrics } from '../../src/utils/calculateMetrics';
import type { Sigillin } from '../../src/types/sigillin';

describe('utils/calculateMetrics', () => {
  it('computes connectionDensity and emergencePotential and lifecycle', () => {
    const s: Sigillin = {
      id: 'x',
      crep: { parts: { coherence: 0.1, resonance: 0.2, emergence: 0.5, poetics: 0.3 } },
      connections: ['a', 'b', 'c'],
      phase: 'experimental',
    };
    const metrics = calculateMetrics(s, 10);
    expect(metrics.connectionDensity).toBeCloseTo(0.3, 6);
    expect(metrics.emergencePotential).toBeCloseTo(0.5 * 0.3, 6);
    expect(metrics.lifecycle).toBe('beta');
  });

  it('handles empty totals and missing parts gracefully', () => {
    const s: Sigillin = { id: 'y', connections: [], phase: 'canonical' } as any;
    const metrics = calculateMetrics(s, 0);
    expect(metrics.connectionDensity).toBe(0);
    expect(metrics.emergencePotential).toBe(0);
    expect(metrics.lifecycle).toBe('production');
  });
});
