import { describe, it, expect } from 'vitest';
import { normalizeCREP } from '../crep';

describe('normalizeCREP', () => {
  it('handles direct number and string score', () => {
    expect(normalizeCREP(1).score).toBe(1);
    expect(normalizeCREP('0.25').score).toBe(0.25);
  });

  it('handles nested crep and score fields', () => {
    expect(normalizeCREP({ crep: { score: '0.7' } }).score).toBe(0.7);
    expect(normalizeCREP({ score: 0.3 }).score).toBe(0.3);
  });

  it('averages lowercase parts and clamps', () => {
    const r = normalizeCREP({ coherence: 1.2, resonance: 0.2, emergence: -0.1 });
    expect(r.source).toBe('lowercase');
    expect(r.parts.c).toBe(1);
    expect(r.parts.e).toBe(0);
    expect(r.score).toBeCloseTo((1 + 0.2 + 0) / 3, 5);
  });

  it('averages uppercase parts and clamps', () => {
    const r = normalizeCREP({ C: 0.5, R: 0.9, P: 2 });
    expect(r.source).toBe('uppercase');
    expect(r.parts.p).toBe(1);
    expect(r.score).toBeCloseTo((0.5 + 0.9 + 1) / 3, 5);
  });

  it('falls back to none when no parts present', () => {
    const r = normalizeCREP({} as any);
    expect(r.source).toBe('none');
    expect(r.score).toBe(0);
  });
});
