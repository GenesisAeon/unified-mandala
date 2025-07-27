import { describe, it, expect } from 'vitest';
import { simulateStructure, generateBlueprint } from './index';

describe('ZivilisationsSandbox', () => {
  it('generates blueprint data', () => {
    const bp = generateBlueprint('Pyramid');
    expect(bp.foundationArea).toBeGreaterThan(0);
    expect(bp.height).toBe(bp.foundationArea / 2);
  });

  it('simulates structure with blueprint info', () => {
    const result = simulateStructure('Pyramid');
    expect(result).toContain('Simulating Pyramid');
    expect(result).toContain('area');
  });
});
