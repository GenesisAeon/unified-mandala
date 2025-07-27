import { describe, it, expect } from 'vitest';
import { simulateBoundaryLaws } from '../BoundaryLawSimulator';

describe('simulateBoundaryLaws', () => {
  it('produces summary string with steps', () => {
    const result = simulateBoundaryLaws(['A','B'], 1);
    expect(result.summary).toBe('A-0,B-0');
  });
});
