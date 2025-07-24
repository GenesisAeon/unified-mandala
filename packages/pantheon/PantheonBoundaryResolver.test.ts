import { describe, it, expect } from 'vitest';
import { PantheonBoundaryResolver } from './PantheonBoundaryResolver';

describe('PantheonBoundaryResolver', () => {
  it('merges unique rules', () => {
    const r = new PantheonBoundaryResolver();
    const result = r.resolve(['a', 'b'], ['b', 'c']);
    expect(result.sort()).toEqual(['a', 'b', 'c']);
  });
});
