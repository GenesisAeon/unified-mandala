import { beforeAll, afterEach, vi, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Env-Defaults für CI/LowMem/Offline
process.env.OFFLINE ??= '1';
process.env.LOW_MEM ??= '1';
process.env.VITE_LOW_MEM ??= 'on';

// Vitest-/Jest-Globals bereitstellen
(Object.assign as any)(globalThis, { vi, expect });
(globalThis as any).jest ||= {
  fn: vi.fn,
  spyOn: vi.spyOn,
  mock: vi.mock,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  useFakeTimers: vi.useFakeTimers,
  useRealTimers: vi.useRealTimers,
};

// OFFLINE erzwingen: existierendes fetch patchen (Node 18/20)
const originalFetch = globalThis.fetch?.bind(globalThis);
const { fetch: undiciFetch } = await import('undici');
(globalThis as any).fetch = (async (input: any, init?: any) => {
  const url = String(typeof input === 'string' ? input : (input?.url ?? input));
  if (process.env.OFFLINE === '1' && /^https?:\/\//i.test(url)) {
    throw new Error('OFFLINE: network calls are disabled in CI');
  }
  const impl = originalFetch ?? (undiciFetch as any);
  return impl(input, init) as any;
}) as any;

// Encoder/Decoder fallback (robust)
try {
  // @ts-ignore
  if (!globalThis.TextEncoder || !globalThis.TextDecoder) {
    const u = await import('node:util');
    // @ts-ignore
    globalThis.TextEncoder = (u as any).TextEncoder;
    // @ts-ignore
    globalThis.TextDecoder = (u as any).TextDecoder;
  }
} catch {
  /* noop */
}

// /tmp-Artefakte seeden
beforeAll(() => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'um-'));
  const p = path.join(tmp, 'newadvanced-stats.json');
  fs.writeFileSync(p, JSON.stringify({ ok: true, t: Date.now() }), 'utf8');
  try {
    fs.copyFileSync(p, '/tmp/newadvanced-stats.json');
  } catch {}
  process.env.UM_TMP_DIR = tmp;
});

afterEach(() => vi.clearAllMocks());
