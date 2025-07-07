import { describe, it, expect } from 'vitest';
import { adjustWeights, mutateWeights, crossoverWeights, AgentWeights } from './CosmicTheoryAgent';

describe('adjustWeights', () => {
  it('increases weights with positive reward', () => {
    const w: AgentWeights = { coherence: 0.5, resonance: 0.5, emergence: 0.5 };
    const metrics: AgentWeights = { coherence: 0.8, resonance: 0.2, emergence: 0.4 };
    const result = adjustWeights(w, metrics, 1, 0.1);
    expect(result.coherence).toBeGreaterThan(w.coherence);
  });

  it('clamps weights between 0 and 1', () => {
    const w: AgentWeights = { coherence: 0.95, resonance: 0.95, emergence: 0.95 };
    const metrics: AgentWeights = { coherence: 1, resonance: 1, emergence: 1 };
    const result = adjustWeights(w, metrics, 1, 1);
    expect(result.coherence).toBeLessThanOrEqual(1);
    expect(result.coherence).toBeGreaterThanOrEqual(0);
  });
});

describe('mutation and crossover', () => {
  it('mutateWeights stays within range', () => {
    const w: AgentWeights = { coherence: 0.5, resonance: 0.5, emergence: 0.5 };
    const mutated = mutateWeights(w, 0.2);
    expect(mutated.coherence).toBeGreaterThanOrEqual(0);
    expect(mutated.coherence).toBeLessThanOrEqual(1);
  });

  it('crossoverWeights picks values from parents', () => {
    const a: AgentWeights = { coherence: 0.1, resonance: 0.2, emergence: 0.3 };
    const b: AgentWeights = { coherence: 0.9, resonance: 0.8, emergence: 0.7 };
    const child = crossoverWeights(a, b);
    expect([a.coherence, b.coherence]).toContain(child.coherence);
    expect([a.resonance, b.resonance]).toContain(child.resonance);
    expect([a.emergence, b.emergence]).toContain(child.emergence);
  });
});
