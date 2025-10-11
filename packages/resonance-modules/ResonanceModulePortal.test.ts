import { describe, it, expect } from 'vitest';
import { ResonanceModulePortal } from './ResonanceModulePortal';

describe('ResonanceModulePortal', () => {
  it('connects modules', () => {
    const p = new ResonanceModulePortal();
    expect(p.connect('a', 'b')).toBe('a->b');
  });
});
