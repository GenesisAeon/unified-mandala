import { describe, it, expect } from 'vitest';
import { combinedWeight } from './weights';

describe('combinedWeight', () => {
  it('multiplies level with factor', () => {
    expect(combinedWeight(2, 3)).toBe(6);
  });
});
