import { TextDecoder, TextEncoder } from "node:util";
import { createRequire } from "node:module";

// Grundlegende Polyfills für Vitest-Läufe im CI.
const globals = globalThis as Record<string, unknown>;

globals.TextEncoder ||= TextEncoder;
globals.TextDecoder ||= TextDecoder;

// CJS-Kompatibilität für einzelne Test-Helfer.
if (!("require" in globals)) {
  globals.require = createRequire(import.meta.url);
}

// Optional: Low-memory Default für CI (durch Tests überschreibbar).
if (!process.env.VITEST_WORKERS) {
  process.env.VITEST_WORKERS = "1";
}

// Node >=18 liefert fetch, aber nicht in allen Umgebungen.
if (!("fetch" in globals)) {
  const undici = createRequire(import.meta.url)("undici");
  Object.assign(globals, {
    fetch: undici.fetch,
    Headers: undici.Headers,
    Request: undici.Request,
    Response: undici.Response,
  });
}
