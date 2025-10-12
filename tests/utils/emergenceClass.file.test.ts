import { describe, it, expect } from 'vitest';
import { emergenceClass } from '../../src/utils/emergenceClass';

describe('utils/emergenceClass (file variant)', () => {
  it('classifies thresholds consistently', () => {
    expect(emergenceClass(0)).toBe('low');
    expect(emergenceClass(0.4)).toBe('medium');
    expect(emergenceClass(0.75)).toBe('high');
  });
});
