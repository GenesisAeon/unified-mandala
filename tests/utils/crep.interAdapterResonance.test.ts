import { describe, it, expect } from 'vitest';
import { interAdapterResonance } from '../../src/utils/crep';

describe('utils/crep interAdapterResonance', () => {
  it('is 1 for equal values', () => {
    expect(interAdapterResonance(0.5, 0.5)).toBe(1);
  });
  it('decreases linearly with absolute difference, floors at 0', () => {
    expect(interAdapterResonance(0.2, 0.5)).toBeCloseTo(0.7, 6); // |0.3| -> 1-0.3
    expect(interAdapterResonance(0, 1)).toBe(0); // |1| -> 0
    expect(interAdapterResonance(-1, 2)).toBe(0); // |3| -> clamp to 0
  });

  it('treats undefined inputs as 0 via nullish coalescing', () => {
    expect(interAdapterResonance(undefined as any, undefined as any)).toBe(1);
    expect(interAdapterResonance(undefined as any, 1.2 as any)).toBe(0); // |1.2| -> clamp to 0
  });
});
