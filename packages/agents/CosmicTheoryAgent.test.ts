import { describe, it, expect } from 'vitest';
import { adjustWeights, AgentWeights } from './CosmicTheoryAgent';

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
