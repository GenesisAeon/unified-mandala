import express from "express";

export type ReadyCheck = () => boolean | Promise<boolean>;

export function buildHealthRouter(opts?: { ready?: ReadyCheck }) {
  const ready = opts?.ready ?? (() => true);
  const r = express.Router();

  // Liveness
  r.get("/healthz", (_req, res) => res.sendStatus(200));

  // Readiness (204 = bereit, 503 = nicht bereit)
  r.get("/readyz", async (_req, res) => {
    try {
      const ok = await Promise.resolve(ready());
      return res.sendStatus(ok ? 204 : 503);
    } catch {
      return res.sendStatus(503);
    }
  });

  return r;
}
