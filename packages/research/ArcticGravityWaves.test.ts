import { describe, it, expect } from 'vitest';
import { analyzeWaves } from './ArcticGravityWaves';

describe('analyzeWaves', () => {
  it('averages data points', () => {
    expect(analyzeWaves([1, 2, 3])).toBeCloseTo(2);
  });
});
