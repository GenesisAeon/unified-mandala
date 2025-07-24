import { describe, it, expect } from 'vitest';
import { BoundaryDiscoveryAgent } from '../boundary_discovery_agent';

describe('BoundaryDiscoveryAgent', () => {
  it('creates rules from observations', () => {
    const agent = new BoundaryDiscoveryAgent();
    agent.addObservation({ timestamp: Date.now(), data: { a: 1 } });
    const rules = agent.discoverRules();
    expect(rules.length).toBe(1);
    expect(rules[0].id).toBe('rule-0');
  });
});
