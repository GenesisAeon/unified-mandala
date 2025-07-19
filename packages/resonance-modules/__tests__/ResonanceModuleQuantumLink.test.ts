import { describe, it, expect } from 'vitest';
import { quantumLink } from '../ResonanceModuleQuantumLink';

describe('ResonanceModuleQuantumLink', () => {
  it('links modules', () => {
    expect(quantumLink('a','b')).toBe('a->b');
  });
});
