import { describe, it, expect } from 'vitest';
import { SecureAggregator } from './SecureAggregator';

describe('SecureAggregator', () => {
  it('averages vectors without noise', () => {
    const agg = new SecureAggregator(0);
    const result = agg.aggregate([
      [1, 2],
      [3, 4]
    ]);
    expect(result).toEqual([2, 3]);
  });
});
