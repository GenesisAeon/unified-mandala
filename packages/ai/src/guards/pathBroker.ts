import path from 'node:path';

export type Scheme = 'repo' | 'scratch' | 'data';

export interface ResolvedUri {
  scheme: Scheme;
  abs: string;
  writable: boolean;
}

const repoRoot = path.resolve(process.cwd());
const scratchRoot = path.resolve(repoRoot, '.ai-scratch');

function ensureWithin(base: string, candidate: string, uri: string): string {
  const normalisedBase = path.resolve(base);
  const resolved = path.resolve(base, candidate);
  if (resolved === normalisedBase) {
    return resolved;
  }

  const withSep = normalisedBase.endsWith(path.sep)
    ? normalisedBase
    : `${normalisedBase}${path.sep}`;

  if (!resolved.startsWith(withSep)) {
    throw new Error(`URI escapes ${base} root: ${uri}`);
  }

  return resolved;
}

export const resolve = (uri: string): ResolvedUri => {
  const match = uri.match(/^([a-zA-Z][\w+.-]*):\/\/(.+)$/);
  if (!match) {
    throw new Error(`Invalid URI: ${uri}`);
  }

  const [, rawScheme, rest] = match as [string, string, string];
  const scheme = rawScheme.toLowerCase() as Scheme;

  if (scheme === 'repo') {
    const abs = ensureWithin(repoRoot, rest, uri);
    return { scheme, abs, writable: false } as const;
  }

  if (scheme === 'scratch') {
    const abs = ensureWithin(scratchRoot, rest, uri);
    return { scheme, abs, writable: true } as const;
  }

  if (scheme === 'data') {
    const dataRoot = process.env.AI_DATA_ROOT;
    if (!dataRoot) {
      throw new Error('AI_DATA_ROOT must be configured to use data:// URIs');
    }
    const abs = ensureWithin(path.resolve(dataRoot), rest, uri);
    return { scheme, abs, writable: true } as const;
  }

  throw new Error(`Unsupported scheme: ${scheme}`);
};
