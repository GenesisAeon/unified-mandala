import { beforeAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.OFFLINE ??= '1';
process.env.LOW_MEM ??= '1';
process.env.VITE_LOW_MEM ??= 'on';

if (typeof fetch === 'undefined') {
  const { fetch: undiciFetch } = await import('undici');
  // @ts-expect-error assign global fetch
  globalThis.fetch = (input: any, init?: any) => {
    const url = String(input ?? '');
    if (process.env.OFFLINE === '1' && /^https?:\/\//i.test(url)) {
      return Promise.reject(new Error('OFFLINE: network calls are disabled in CI'));
    }
    return undiciFetch(input as any, init as any) as any;
  };
}

beforeAll(() => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'um-'));
  const statsPath = path.join(tmpDir, 'newadvanced-stats.json');
  fs.writeFileSync(statsPath, JSON.stringify({ ok: true, t: Date.now() }));
  try {
    fs.copyFileSync(statsPath, '/tmp/newadvanced-stats.json');
  } catch {}
  process.env.UM_TMP_DIR = tmpDir;
});
