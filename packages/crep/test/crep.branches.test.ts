import { describe, it, expect } from 'vitest';
import { computeCoherence, computeEmergence, computePoetics, type Graph } from '../src/crep';

describe('CREP branch coverage extras', () => {
  it('coherence returns neutral when labels missing', () => {
    const g: Graph = {
      nodes: ['a', 'b'],
      edges: [{ source: 'a', target: 'b' }],
      // no labels
    };
    expect(computeCoherence(g)).toBeCloseTo(0.5, 5);
  });

  it('poetics defaults entropy to 0.5 without labels and factors structure', () => {
    const g: Graph = {
      nodes: ['a', 'b'],
      edges: [], // density=0 => structure=1
    } as any;
    // entropy=0.5, structure=1 => 0.5*0.5 + 0.5*1 = 0.75
    expect(computePoetics(g)).toBeCloseTo(0.75, 5);
  });

  it('emergence with disconnected nodes and no labels uses bridgeRatio=0.5', () => {
    const g: Graph = {
      nodes: ['a', 'b', 'c'],
      edges: [],
      // no labels -> fallback branch, edges.length===0 => bridgeRatio=0.5
    } as any;
    // components = 3 => separation = 1 - 1/3 = 2/3; emergence = separation * (1-0.5) = 1/3
    const e = computeEmergence(g);
    expect(e).toBeGreaterThan(0.3);
    expect(e).toBeLessThan(0.34);
  });
});

