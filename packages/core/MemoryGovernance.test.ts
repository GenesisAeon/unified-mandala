import { describe, it, expect } from 'vitest';
import { MemoryGovernance } from './MemoryGovernance';

describe('MemoryGovernance', () => {
  it('stores and retrieves memory entries', () => {
    const mg = new MemoryGovernance();
    mg.set('foo', 'bar');
    expect(mg.get('foo')).toBe('bar');
    expect(mg.has('foo')).toBe(true);
    mg.delete('foo');
    expect(mg.has('foo')).toBe(false);
  });

  it('clears all entries', () => {
    const mg = new MemoryGovernance();
    mg.set('a', '1');
    mg.set('b', '2');
    mg.clear();
    expect(mg.entries()).toHaveLength(0);
  });
});
