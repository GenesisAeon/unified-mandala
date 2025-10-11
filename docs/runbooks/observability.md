# Observability

- Logging: `packages/logging/*` (pino + AsyncLocalStorage)
- Request-Logs: `src/middleware/request-logger.ts`
- Health: `/healthz`, `/readyz` (Version, Zeit)
- Event Bus: `packages/bus/` (mitt, optional Redis bridge)
- Locks: `packages/lock/` (Redis bevorzugt, FS-Fallback)

## Env

- `LOG_LEVEL=debug`
- `REDIS_URL=redis://localhost:6379` (optional)

## ALS & Logging

- Steuerung: `LOG_CONTEXT=off` (deaktiviert), `LOG_CONTEXT_SAMPLE=0.25` (25% Sampling)

## Readiness

- `/readyz` prüft Redis, wenn `REDIS_URL` gesetzt ist.

## Locks

- Stale-Cleanup beim Start (älter als 5 Min).

## Event Bus

- `onSafe()` fängt Handler-Fehler ab → `packages/bus/dlq`.
