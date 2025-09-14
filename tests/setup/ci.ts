import { beforeAll, afterEach, vi, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Env-Defaults für CI/LowMem/Offline
process.env.OFFLINE ??= "1";
process.env.LOW_MEM ??= "1";
process.env.VITE_LOW_MEM ??= "on";

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

// OFFLINE erzwingen: existierendes fetch immer patchen (Node 18+)
{
  const orig = globalThis.fetch;
  const { fetch: undiciFetch } = await import("undici");
  const base = typeof orig === "function" ? orig : (undiciFetch as any);
  // @ts-expect-error assign global fetch
  globalThis.fetch = (input: any, init?: any) => {
    const url = String(input ?? "");
    if (process.env.OFFLINE === "1" && /^https?:\/\//i.test(url)) {
      return Promise.reject(new Error("OFFLINE: network calls are disabled in CI"));
    }
    return base(input as any, init as any) as any;
  };
}

// Encoder/Decoder fallback (robust)
try {
  // @ts-ignore
  if (!globalThis.TextEncoder || !globalThis.TextDecoder) {
    const u = await import("node:util");
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
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "um-"));
  const p = path.join(tmp, "newadvanced-stats.json");
  fs.writeFileSync(p, JSON.stringify({ ok: true, t: Date.now() }), "utf8");
  try { fs.copyFileSync(p, "/tmp/newadvanced-stats.json"); } catch {}
  process.env.UM_TMP_DIR = tmp;
});

afterEach(() => vi.clearAllMocks());

