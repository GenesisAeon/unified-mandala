import { promises as fs } from 'node:fs';
import path from 'node:path';
import { resolve } from './pathBroker.js';

const ensureDir = async (filePath: string) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
};

export const readFileURI = async (uri: string): Promise<string> => {
  const resolved = resolve(uri);
  return fs.readFile(resolved.abs, 'utf8');
};

export const writeFileURI = async (uri: string, content: string | Buffer) => {
  const resolved = resolve(uri);
  if (!resolved.writable) {
    throw new Error(`Writes to ${resolved.scheme} are forbidden: ${uri}`);
  }

  await ensureDir(resolved.abs);
  await fs.writeFile(resolved.abs, content);
  return { ok: true, path: resolved.abs } as const;
};

export const existsURI = async (uri: string) => {
  const resolved = resolve(uri);
  try {
    await fs.access(resolved.abs);
    return true;
  } catch {
    return false;
  }
};
