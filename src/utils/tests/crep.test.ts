import { describe, it, expect } from 'vitest';
import { interAdapterResonance } from '../crep';

describe('utils/crep interAdapterResonance', () => {
  it('returns 1 for equal values', () => {
    expect(interAdapterResonance(0.7, 0.7)).toBe(1);
  });

  it('decreases linearly with absolute difference and clamps at 0', () => {
    expect(interAdapterResonance(0, 0.5)).toBeCloseTo(0.5, 5);
    expect(interAdapterResonance(0, 1.5)).toBe(0);
  });

  it('treats undefined inputs as 0 via nullish coalescing', () => {
    expect(interAdapterResonance(undefined as any, 0.25)).toBeCloseTo(0.75, 5);
    expect(interAdapterResonance(0.25, undefined as any)).toBeCloseTo(0.75, 5);
  });
});
