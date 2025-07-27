import { describe, it, expect } from 'vitest';
import { SigilDriver } from '../SigilDriver';

class TestDriver extends SigilDriver {
  async connect() {}
  async disconnect() {}
}

describe('SigilDriver', () => {
  it('stores metadata', () => {
    const d = new TestDriver({ id: 'x' });
    expect(d.meta.id).toBe('x');
  });
});
