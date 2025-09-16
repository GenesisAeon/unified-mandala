// Vitest CI Setup: Polyfills & strict mode toggles
import { TextEncoder, TextDecoder } from "node:util";
import { createRequire } from "node:module";

(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;
// CJS-Kompat für einzelne Test-Helfer:
(globalThis as any).require = createRequire(import.meta.url);

// Optional: Low-memory Default für CI
if (!process.env.VITEST_WORKERS) {
  process.env.VITEST_WORKERS = "1";
}
// JSDOM: fetch ist in Node >=18 vorhanden; zur Sicherheit:
if (!("fetch" in globalThis)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { fetch, Headers, Request, Response } = require("undici");
  Object.assign(globalThis, { fetch, Headers, Request, Response });
}

// Optional offline guardrail: enable to force tests to stub network requests in CI.
// if (process.env.OFFLINE === "1") {
//   globalThis.fetch = () => Promise.reject(new Error("Network access disabled in OFFLINE mode"));
// }
