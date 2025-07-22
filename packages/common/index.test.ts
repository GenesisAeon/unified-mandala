import { describe, it, expect } from 'vitest';
import { sum } from './index';

describe('common utils', () => {
  it('sums numbers', () => {
    expect(sum(1,2)).toBe(3);
  });
});
