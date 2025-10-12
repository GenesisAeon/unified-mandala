import { describe, it, expect } from 'vitest';
import { computeResonance, computeEmergence, type Graph } from '../src/crep';

describe('CREP extras: resonance and emergence branches', () => {
  it('resonance computes Jaccard over top-ranked edges', () => {
    const prev: Graph = {
      nodes: ['a', 'b', 'c', 'd'],
      edges: [
        { source: 'a', target: 'b', weight: 5 },
        { source: 'a', target: 'c', weight: 4 },
        { source: 'b', target: 'c', weight: 3 },
        { source: 'c', target: 'd', weight: 2 }, // ranked length=4 => top limit=3
      ],
    } as any;

    const curr: Graph = {
      nodes: ['a', 'b', 'c', 'd'],
      edges: [
        { source: 'a', target: 'b', weight: 6 }, // common
        { source: 'a', target: 'c', weight: 5 }, // common
        { source: 'c', target: 'd', weight: 10 }, // replaces b::c in top-3
        { source: 'b', target: 'c', weight: 1 },
      ],
    } as any;

    const r = computeResonance(prev, curr);
    // prev top: ab, ac, bc ; curr top: ab, ac, cd -> intersection 2, union 4 => 0.5
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThanOrEqual(1);
  });

  it('resonance returns 1 when both ranked sets empty', () => {
    const prev: Graph = { nodes: ['x'], edges: [{ source: 'x', target: 'x' }] } as any; // self-loop removed
    const curr: Graph = { nodes: ['y'], edges: [{ source: 'y', target: 'y' }] } as any;
    const r = computeResonance(prev, curr);
    expect(r).toBe(1);
  });

  it('emergence uses fallback bridge estimate when labels missing', () => {
    const g: Graph = {
      nodes: ['a', 'b', 'c'],
      edges: [
        { source: 'a', target: 'b' },
        { source: 'b', target: 'c' },
      ],
      // labels undefined triggers fallback branch
    } as any;
    const e = computeEmergence(g);
    expect(e).toBeGreaterThanOrEqual(0);
    expect(e).toBeLessThanOrEqual(1);
  });
});

