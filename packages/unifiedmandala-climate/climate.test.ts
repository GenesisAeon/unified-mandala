import { describe, it, expect } from 'vitest';
import { getClimateStatus } from './index';

describe('getClimateStatus', () => {
  it('returns climate status', () => {
    expect(getClimateStatus(35)).toBe('hot');
    expect(getClimateStatus(10)).toBe('mild');
  });
});
