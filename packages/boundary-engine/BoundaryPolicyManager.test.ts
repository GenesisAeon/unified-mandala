import { describe, it, expect } from 'vitest';
import { BoundaryPolicyManager } from './BoundaryPolicyManager';

describe('BoundaryPolicyManager', () => {
  it('adds and removes policies', () => {
    const mgr = new BoundaryPolicyManager();
    mgr.add({ id: 'p1', rules: ['r1'] });
    expect(mgr.get('p1')?.rules).toEqual(['r1']);
    mgr.remove('p1');
    expect(mgr.get('p1')).toBeUndefined();
  });
});
