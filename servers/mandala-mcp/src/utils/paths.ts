import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(here, '../../../..');

export function getRepoRoot(): string {
  const configured = process.env.MANDALA_REPO_ROOT;
  const resolved = configured ? path.resolve(configured) : defaultRoot;
  if (!fs.existsSync(resolved)) {
    return fs.realpathSync(defaultRoot);
  }
  return fs.realpathSync(resolved);
}

export function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}
