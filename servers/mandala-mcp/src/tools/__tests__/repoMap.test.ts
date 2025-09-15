import { describe, expect, it } from 'vitest';
import { loadRepoMap } from '../repoMap.js';

describe('repo map', () => {
  it('falls back to minimal map if files are missing or invalid', () => {
    const map = loadRepoMap();
    expect(map.name).toBeTruthy();
    expect(Array.isArray(map.ebenen)).toBe(true);
  });
});
