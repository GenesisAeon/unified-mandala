import { describe, it, expect } from 'vitest';
import { BoundaryDiscoveryAgent } from '../BoundaryDiscoveryAgent';

describe('BoundaryDiscoveryAgent', () => {
  it('detects discontinuities', () => {
    const agent = new BoundaryDiscoveryAgent();
    const res = agent.detect([{ x: 1 }, { y: 2 }]);
    expect(res).toHaveLength(2);
    expect(res[0].id).toBe('disc-0');
  });
});
