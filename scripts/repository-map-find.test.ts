import { describe, it, expect } from 'vitest';
import { findRepositoriesByModule } from './repository-map-find';

describe('findRepositoriesByModule', () => {
  it('returns repositories containing module', () => {
    const repos = findRepositoriesByModule('sigillin-validator.ts');
    expect(repos).toContain('aeon');
  });

  it('returns empty array for unknown module', () => {
    const repos = findRepositoriesByModule('non-existent-module.ts');
    expect(repos).toEqual([]);
  });
});
