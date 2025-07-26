import { describe, it, expect } from 'vitest';
import { MemoryGovernance } from './MemoryGovernance';

describe('MemoryGovernance', () => {
  it('stores and retrieves memory entries', () => {
    const mg = new MemoryGovernance();
    mg.set('foo', 'bar');
    expect(mg.get('foo')).toBe('bar');
  });
});
