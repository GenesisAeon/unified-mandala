import { describe, it, expect } from 'vitest';
import { tune } from './ResonanceTuningKit';

describe('ResonanceTuningKit', () => {
  it('multiplies values', () => {
    expect(tune(2, 3)).toBe(6);
  });
});
