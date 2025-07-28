import { describe, it, expect } from 'vitest';
import { toCuneiform, fromCuneiform } from './KeilschriftTranslator';

describe('KeilschriftTranslator', () => {
  it('roundtrips text', () => {
    const c = toCuneiform('abc');
    expect(fromCuneiform(c)).toBe('abc');
  });
});
