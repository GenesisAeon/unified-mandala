// tests/setup/ci.ts
import { beforeAll, afterEach, vi, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

// 1) CI/LowMem/Offline Defaults
process.env.OFFLINE ??= "1";
process.env.LOW_MEM ??= "1";
process.env.VITE_LOW_MEM ??= "on";

// 2) Vitest-Globals (falls Tests jest-Style nutzen)
(Object.assign as any)(globalThis, {
  vi,
  expect,
});

(globalThis as any).require ||= createRequire(import.meta.url);

// Minimaler "jest"-Shim für Alt-Tests
(globalThis as any).jest ||= {
  fn: vi.fn,
  spyOn: vi.spyOn,
  mock: vi.mock,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  resetModules: vi.resetModules,
  useFakeTimers: vi.useFakeTimers,
  useRealTimers: vi.useRealTimers,
};

// 3) OFFLINE: existierendes fetch patchen (Node 18/20)
const originalFetch = globalThis.fetch?.bind(globalThis);
const { fetch: undiciFetch } = await import("undici");
(globalThis as any).fetch = (async (input: any, init?: any) => {
  const url = String(typeof input === "string" ? input : input?.url ?? input);
  if (process.env.OFFLINE === "1" && /^https?:\/\//i.test(url)) {
    throw new Error("OFFLINE: network calls are disabled in CI");
  }
  const impl = originalFetch ?? (undiciFetch as any);
  return impl(input, init) as any;
}) as any;

// 4) TextEncoder/Decoder (robust, falls in \u00e4lteren Umgebungen fehlen)
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

// 5) /tmp-Artefakte f\u00fcr Tests seeden
beforeAll(() => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "um-"));
  const statsPath = path.join(tmpDir, "newadvanced-stats.json");
  fs.writeFileSync(statsPath, JSON.stringify({ ok: true, t: Date.now() }), "utf8");
  try {
    fs.copyFileSync(statsPath, "/tmp/newadvanced-stats.json");
  } catch {}
  process.env.UM_TMP_DIR = tmpDir;
  try {
    const outDir = path.resolve("out");
    fs.mkdirSync(outDir, { recursive: true });
    const adaptersPath = path.join(outDir, "adapters_index.json");
    if (!fs.existsSync(adaptersPath)) {
      fs.writeFileSync(
        adaptersPath,
        JSON.stringify({ adapters: [{ id: "oisst", kind: "oisst" }] }),
        "utf8"
      );
    }
  } catch {}
});

afterEach(() => {
  vi.clearAllMocks();
});
