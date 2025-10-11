# Adapter-Matrix

| Quelle | Pfad                            | Status | Intervall | Auth | Throttle (N/Δt) | Cache (TTL) | Schema |
| -----: | ------------------------------- | :----: | :-------: | :--: | :-------------: | :---------: | :----: |
|   ERA5 | src/adapters/impl/era5.stub.ts  |  Stub  |     —     |  —   |     5 / 1s      |     60s     |  Zod   |
|  OISST | src/adapters/impl/oisst.stub.ts |  Stub  |     —     |  —   |     5 / 1s      |     60s     |  Zod   |

**Decorators aktiv:** `withRetry(3×,exp backoff) → withRateLimit(5/1s) → withCache(60s) → withSchema(Zod)`

**Hinweis:** Für Live-Feeds hier ergänzen: Intervall, Auth (Token/API-Key), konkrete Limits (z. B. 30/min), und Ausgabeschemata.
