import fs from 'node:fs';
import path from 'node:path';
import { getRepoRoot } from '../utils/paths.js';

function withSep(p: string) {
  return p.endsWith(path.sep) ? p : p + path.sep;
}

export function underRepoRoot(target: string): boolean {
  const repoRoot = fs.realpathSync(getRepoRoot());
  const absReal = fs.realpathSync(path.resolve(target));
  return absReal.startsWith(withSep(repoRoot));
}

export function assertUnderRepoRoot(target: string) {
  if (!underRepoRoot(target)) {
    const err = new Error('path_not_allowed');
    (err as NodeJS.ErrnoException).code = 'path_not_allowed';
    throw err;
  }
}
