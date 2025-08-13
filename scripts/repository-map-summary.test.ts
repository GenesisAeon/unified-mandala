import { describe, it, expect } from 'vitest';
import { summarizeRepositoryMap } from './repository-map-summary';

describe('summarizeRepositoryMap', () => {
  it('returns text summary by default', () => {
    const result = summarizeRepositoryMap();
    expect(result).toContain('aeon:');
  });

  it('returns JSON summary when json option is true', () => {
    const result = summarizeRepositoryMap({ json: true }) as Record<string, number>;
    expect(result.aeon).toBeGreaterThan(0);
  });
});
