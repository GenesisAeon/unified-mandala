import { describe, it, expect } from 'vitest';
import { PantheonMemorySync } from './PantheonMemorySync';

describe('PantheonMemorySync', () => {
  it('stores and retrieves values', () => {
    const sync = new PantheonMemorySync();
    sync.set('foo', 42);
    expect(sync.get('foo')).toBe(42);
    expect(sync.snapshot()).toEqual({ foo: 42 });
  });
});
