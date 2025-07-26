import { describe, it, expect } from 'vitest';
import { simulateStructure } from './index';

describe('simulateStructure', () => {
  it('simulates structure name', () => {
    expect(simulateStructure('Pyramid')).toBe('Simulating Pyramid');
  });
});
