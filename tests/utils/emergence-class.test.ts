import { describe, it, expect } from 'vitest';
import { emergenceClass } from '../../src/utils/classify';

describe('utils/emergenceClass', () => {
  it('classifies low/medium/high at thresholds', () => {
    expect(emergenceClass(0)).toBe('low');
    expect(emergenceClass(0.3999)).toBe('low');
    expect(emergenceClass(0.4)).toBe('medium');
    expect(emergenceClass(0.74)).toBe('medium');
    expect(emergenceClass(0.75)).toBe('high');
    expect(emergenceClass(1)).toBe('high');
  });
});
