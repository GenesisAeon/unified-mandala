import { describe, it, expect } from 'vitest';
import { analyzeWaves, estimateAmplitude } from './ArcticGravityWaves';

describe('analyzeWaves', () => {
  it('averages data points', () => {
    expect(analyzeWaves([1, 2, 3])).toBeCloseTo(2);
  });

  it('estimates amplitude', () => {
    expect(estimateAmplitude([1, 2, 3])).toBeCloseTo(0.816, 2);
  });
});
