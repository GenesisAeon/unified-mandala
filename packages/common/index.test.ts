import { describe, it, expect } from 'vitest';
import { sum, clamp, unique, shuffle } from './index';

describe('common utils', () => {
  it('sums numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('clamps values', () => {
    expect(clamp(5, 0, 3)).toBe(3);
  });

  it('returns unique items', () => {
    expect(unique([1, 1, 2]).length).toBe(2);
  });

  it('shuffles array', () => {
    const arr = [1, 2, 3];
    const shuffled = shuffle(arr);
    expect(shuffled).toHaveLength(3);
  });
});
