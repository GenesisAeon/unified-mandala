// Polyfills/bridges for tests
import { TextEncoder, TextDecoder } from "node:util";
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;

// Node 20 hat fetch nativ; Fallback nur falls lokal <20 genutzt wird
if (typeof (globalThis as any).fetch === "undefined") {
  const undici = await import("undici");
  Object.assign(globalThis, {
    fetch: undici.fetch,
    Headers: undici.Headers,
    Request: undici.Request,
    Response: undici.Response,
  });
}

