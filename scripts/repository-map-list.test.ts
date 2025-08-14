import { describe, it, expect } from 'vitest';
import { listRepositoryMap } from './repository-map-list';

describe('listRepositoryMap', () => {
  it('includes modules for aeon repository', () => {
    const result = listRepositoryMap({ json: true }) as Record<string, string[]>;
    expect(result.aeon).toContain('sigillin-validator.ts');
  });
});
