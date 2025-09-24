export type Plane = 'repo' | 'scratch' | 'data';

interface RoutedPath {
  plane: Plane;
  path: string;
}

const stripLeadingSlash = (value: string) => value.replace(/^\/+/, '');

/**
 * Resolve a requested path to a writable plane. Any unknown scheme defaults to scratch:// to prevent repo writes.
 */
export function resolveWritePath(requested: string): RoutedPath {
  if (/^data:\/\//i.test(requested)) {
    return { plane: 'data', path: stripLeadingSlash(requested.replace(/^data:\/\//i, '')) };
  }

  if (/^scratch:\/\//i.test(requested)) {
    return { plane: 'scratch', path: stripLeadingSlash(requested.replace(/^scratch:\/\//i, '')) };
  }

  if (/^repo:\/\//i.test(requested)) {
    throw new Error(`Writes to repo:// are forbidden (${requested})`);
  }

  return { plane: 'scratch', path: stripLeadingSlash(requested) };
}

/**
 * Guard read operations so repo:// access cannot escape guarded directories.
 */
export function assertReadOnlyRepoPath(candidate: string) {
  if (/packages\/[^/]+\/core\//.test(candidate)) {
    throw new Error('Read-only core path access denied');
  }
}
