import { describe, it, expect } from 'vitest';
import { toCuneiform } from './KeilschriftTranslator';

describe('toCuneiform', () => {
  it('translates basic letters', () => {
    expect(toCuneiform('AB')).toBe('\u12000\u12001');
  });
});
