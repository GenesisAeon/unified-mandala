import { describe, it, expect } from 'vitest';
import { transliterate } from './index';

describe('transliterate', () => {
  it('removes dashes from text', () => {
    expect(transliterate('KU-NU')).toBe('KUNU');
  });
});
