// Vitest CI Setup: Polyfills & strict mode toggles
// Optional: set VITEST_STRICT_FETCH=1 to remove global fetch and guard against accidental network calls.
import { TextEncoder, TextDecoder } from "node:util";
import { createRequire } from "node:module";

(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;
// CJS-Kompat für einzelne Test-Helfer:
(globalThis as any).require = createRequire(import.meta.url);

if (process.env.VITEST_STRICT_FETCH === "1") {
  delete (globalThis as any).fetch;
}

// Optional: Low-memory Default für CI
if (!process.env.VITEST_WORKERS) {
  process.env.VITEST_WORKERS = "1";
}

// Reporter-Fallback: Vitest Dot-Reporter erwartet eine gültige Terminalbreite
const applyColumnFallback = (stream: typeof process.stdout | typeof process.stderr | undefined) => {
  if (!stream) return;
  const columns = (stream as any).columns;
  if (!Number.isFinite(columns) || columns === 0) {
    try {
      Object.defineProperty(stream, "columns", {
        configurable: true,
        enumerable: false,
        get: () => 80,
      });
    } catch {
      /* noop */
    }
  }
};

applyColumnFallback(process.stdout as typeof process.stdout | undefined);
applyColumnFallback(process.stderr as typeof process.stderr | undefined);
// JSDOM: fetch ist in Node >=18 vorhanden; zur Sicherheit:
if (!("fetch" in globalThis)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { fetch, Headers, Request, Response } = require("undici");
  Object.assign(globalThis, { fetch, Headers, Request, Response });
}
