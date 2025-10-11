import { describe, it, expect } from 'vitest';
import { ResonanzpfadAgent } from '../ResonanzpfadAgent';

describe('ResonanzpfadAgent', () => {
  it('detects archetype and resonance patterns', () => {
    const agent = new ResonanzpfadAgent();
    const logs = ['Archetyp Alpha erkannt', 'keine relevanz', 'starke Resonanz im Pfad'];
    const result = agent.analyze(logs);
    expect(result.archetypeHits).toBe(1);
    expect(result.resonanceScore).toBe('starke Resonanz im Pfad'.length);
  });
});
