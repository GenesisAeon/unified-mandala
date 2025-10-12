import { describe, it, expect } from 'vitest';
import { calculateMetrics } from '../calculateMetrics';
import { emergenceClass } from '../classify';
import { classifyEmergence } from '../emergenceClass';
import { normalizeCREP } from '../normalizeCREP';
import type { Sigillin } from '../../types/sigillin';

describe('utils: metrics, classify, normalizeCREP', () => {
  it('calculateMetrics computes density, emergence potential and lifecycle', () => {
    const s: Sigillin = {
      id: 's1',
      crep: { parts: { coherence: 0.2, resonance: 0.3, emergence: 0.4, poetics: 0.5 } },
      connections: ['a', 'b'],
      phase: 'canonical',
    };
    const m = calculateMetrics(s, 10);
    expect(m.connectionDensity).toBeCloseTo(2 / 10, 6);
    expect(m.emergencePotential).toBeCloseTo(0.4 * (2 / 10), 6);
    expect(m.lifecycle).toBe('production');
  });

  it('emergenceClass maps thresholds', () => {
    expect(emergenceClass(0.8)).toBe('high');
    expect(emergenceClass(0.5)).toBe('medium');
    expect(emergenceClass(0.1)).toBe('low');
  });

  it('classifyEmergence maps thresholds (alternate implementation)', () => {
    expect(classifyEmergence(0.8)).toBe('high');
    expect(classifyEmergence(0.5)).toBe('medium');
    expect(classifyEmergence(0.1)).toBe('low');
  });

  it('normalizeCREP reads parts and derives score when missing', () => {
    const out = normalizeCREP({ coherence: 0.2, R: 0.4, e: 0.6, P: 0.8 });
    expect(out).toBeDefined();
    expect(out!.score).toBeCloseTo((0.2 + 0.4 + 0.6 + 0.8) / 4, 6);
    expect(out!.parts.coherence).toBe(0.2);
    expect(out!.parts.resonance).toBe(0.4);
    expect(out!.parts.emergence).toBe(0.6);
    expect(out!.parts.poetics).toBe(0.8);
  });
});
