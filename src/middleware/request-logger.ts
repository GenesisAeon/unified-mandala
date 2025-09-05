import { runWithCtx } from "../../packages/logging/context";
import { logWithContext } from "../../packages/logging/logger";
import { randomUUID } from "crypto";
import type { IncomingMessage, ServerResponse } from "http";
export function requestLogger(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const reqId = (req.headers["x-request-id"] as string) || randomUUID();
  const start = Date.now();
  runWithCtx({ requestId: reqId }, () => {
    const log = logWithContext();
    log.info({ method: req.method, url: req.url }, "req:start");
    const done = () => {
      res.off("finish", done); res.off("close", done);
      log.info({ status: res.statusCode, ms: Date.now() - start }, "req:end");
    };
    res.on("finish", done); res.on("close", done);
    next();
  });
}
