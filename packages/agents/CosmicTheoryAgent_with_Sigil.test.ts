import { describe, it, expect } from 'vitest';

class MockSigil {
  currentSigil() {
    return 'sigil';
  }
}
import { CosmicTheoryAgentWithSigil } from './CosmicTheoryAgent_with_Sigil';

describe('CosmicTheoryAgentWithSigil', () => {
  it('prefixes text with sigil', () => {
    const agent = new CosmicTheoryAgentWithSigil(new MockSigil() as any);
    expect(agent.analyze('text')).toBe('sigil: text');
  });
});
