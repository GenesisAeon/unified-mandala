import { describe, it, expect } from 'vitest';
import { discoverPatterns } from './BoundaryLawAgentAlgorithm';

describe('discoverPatterns', () => {
  it('counts occurrences', () => {
    const result = discoverPatterns(['a', 'b', 'a']);
    expect(result).toEqual({ a: 2, b: 1 });
  });
});
