import { describe, it, expect } from 'vitest';
import { SecureAggregator } from './SecureAggregator';

describe('SecureAggregator', () => {
  it('averages vectors without noise', () => {
    const agg = new SecureAggregator();
    agg.addUpdate([1, 2]);
    agg.addUpdate([3, 4]);
    const result = agg.aggregate();
    expect(result).toEqual([2, 3]);
  });
});
