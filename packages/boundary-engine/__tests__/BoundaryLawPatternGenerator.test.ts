import { describe, it, expect } from 'vitest';
import { generatePatterns } from '../BoundaryLawPatternGenerator';

describe('generatePatterns', () => {
  it('generates difference patterns', () => {
    expect(generatePatterns([1, 2, 4])).toEqual([1, 2]);
  });
});
