import { describe, it, expect } from 'vitest';
import { bayesFactor, jeffreys } from '../src/bayes';

describe('epistemic/bayes', () => {
  it('clamps inputs and computes bayes factor', () => {
    // values outside [0,1] should be clamped internally
    const bf = bayesFactor([1.2, -0.5, 0.5], [0, 2]);
    expect(bf).toBeGreaterThan(0);
    expect(Number.isFinite(bf)).toBe(true);
  });

  it('classifies strength via Jeffreys scale', () => {
    expect(jeffreys(0.9)).toBe('inconclusive');
    expect(jeffreys(1)).toBe('weak');
    expect(jeffreys(2.9)).toBe('weak');
    expect(jeffreys(3)).toBe('moderate');
    expect(jeffreys(9.9)).toBe('moderate');
    expect(jeffreys(10)).toBe('strong');
    expect(jeffreys(29.9)).toBe('strong');
    expect(jeffreys(30)).toBe('decisive');
  });
});

