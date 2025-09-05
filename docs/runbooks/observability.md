# Observability
- Logging: `packages/logging/*` (pino + AsyncLocalStorage)
- Request-Logs: `src/middleware/request-logger.ts`
- Health: `/healthz`, `/readyz` (Version, Zeit)
- Event Bus: `packages/bus/` (mitt, optional Redis bridge)
- Locks: `packages/lock/` (Redis bevorzugt, FS-Fallback)
## Env
- `LOG_LEVEL=debug`
- `REDIS_URL=redis://localhost:6379` (optional)
