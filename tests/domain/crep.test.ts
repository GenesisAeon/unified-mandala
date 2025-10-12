import { describe, it, expect } from 'vitest';
import { normalizeCREP } from '../../src/domain/crep';

describe('domain/normalizeCREP', () => {
  it('accepts direct numeric and string score', () => {
    expect(normalizeCREP(0.75)).toEqual({ score: 0.75, parts: {}, source: 'score' });
    expect(normalizeCREP('0.25')).toEqual({ score: 0.25, parts: {}, source: 'score' } as any);
  });

  it('reads score property and clamps', () => {
    expect(normalizeCREP({ score: 2 }).score).toBe(1);
    expect(normalizeCREP({ score: -1 }).score).toBe(0);
  });

  it('averages lowercase parts', () => {
    const r = normalizeCREP({ coherence: 0.2, resonance: 0.4 });
    expect(r.source).toBe('lowercase');
    expect(r.score).toBeCloseTo(0.3, 6);
  });

  it('averages uppercase parts', () => {
    const r = normalizeCREP({ C: 0.5, R: 0.7 });
    expect(r.source).toBe('uppercase');
    expect(r.score).toBeCloseTo(0.6, 6);
  });

  it('unwraps nested crep', () => {
    const r = normalizeCREP({ crep: { score: 0.55 } } as any);
    expect(r.source).toBe('score');
    expect(r.score).toBe(0.55);
  });

  it('falls back to none when nothing useful', () => {
    const r = normalizeCREP({} as any);
    expect(r.source).toBe('none');
    expect(r.score).toBe(0);
  });
});
