import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { underRepoRoot } from '../allowlist.js';
import { getRepoRoot } from '../../utils/paths.js';

describe('allowlist', () => {
  it('accepts a path under repo root', () => {
    const repoRoot = getRepoRoot();
    const candidate = path.resolve(repoRoot, 'README.md');
    expect(underRepoRoot(candidate)).toBe(true);
  });

  it('rejects a path outside the repo root', () => {
    const repoRoot = getRepoRoot();
    const outside = '/etc/passwd';
    expect(underRepoRoot(outside)).toBe(false);
  });
});
