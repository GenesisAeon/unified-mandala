import { describe, it, expect } from 'vitest';
import { defaultPolicy } from './policy';

describe('MemoryGovernancePolicy', () => {
  it('provides default rules', () => {
    expect(defaultPolicy.find(p=>p.category==='daily')?.maxAgeDays).toBe(7);
  });
});
