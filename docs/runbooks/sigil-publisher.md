# Sigil Publisher Runbook

Scope: Integrate `publishSigilMessage` across bridges (membrane, boundary, KPI, future detectors) with runtime guards, logging and dedupe expectations.

## Prerequisites

- Node 20 runtime with `@opentelemetry/api` available (optional but recommended).
- `schemas/sigil-message/1-0-0.schema.json` present; changes require schema + fingerprint bump.
- Directory `data/logs/sigils/` committed with `.gitkeep` so JSONL snapshots rotate safely.

## Wiring Steps

1. **Import the runtime guard.**

   ```ts
   import { publishSigilMessage } from '../../src/runtime/sigil/publisher';
   ```

   - Consumers should build messages through `buildSigilMessage` (keeps schema invariants and context trimming in sync).

2. **Provide a logger (optional).**

   ```ts
   const logger = scopedLogger.child({ component: 'sigil-bridge' });
   await publishSigilMessage(message, { logger });
   ```

   - Absent a logger the publisher logs JSON via `console.info/error`.

3. **Configure bus/topic (optional).**

   ```ts
   await publishSigilMessage(message, {
     bus: eventBus,
     topic: 'sigil.event',
   });
   ```

   - When `bus` is provided, messages are forwarded before the optional publisher hook/listeners run.

4. **Register downstream listeners (optional).**

   ```ts
   import { onSigilMessage } from '../../src/runtime/sigil/publisher';
   const unsubscribe = onSigilMessage((sigil) => metricsBuffer.push(sigil));
   ```

5. **Boundary coupling.**
   - Provide `context.boundaryLawId` when the message is tied to a law; boundary smokes enforce unique `eventKey` combinations (rule+verdict+source).
   - Pair `publishBoundary` invocations with the same `boundaryLawId` to keep dedupe consistent.
   - HTTP-Producer sollen `Idempotency-Key` (SHA1 von `ruleId|source|ts|canonical(payload)`) mitsenden – Boundary übernimmt ihn als `eventKey`/Header und liefert 202/409 symmetrisch zurück.
   - Der Standard-JavaScript-Publisher (`publishBoundary`) hängt den Header seit Fraktal97 automatisch an; eigene Bridges (Python, Go, CLI) müssen ihn weiterhin explizit setzen.

6. **Metrics expectations.**
   - `sigil_emitted_total{valid="true|false",severity,state,kpi}` increments automatically.
   - Span attributes (`sigil.severity`, `sigil.state`, `sigil.kpi`, `sigil.schemaVersion`) are emitted when an OpenTelemetry tracer is available.

7. **Snapshot writer.**
   - JSONL append lives under `data/logs/sigils/events.jsonl` with rotation (default 10k lines). Override via `logFile` / `rotateAfter` if a custom path is required.
   - Ensure `data/logs/sigils/` exists locally (`mkdir -p data/logs/sigils && touch data/logs/sigils/.gitkeep`).

8. **Validation failures.**
   - Invalid payloads throw with Ajv diagnostics and increment `sigil_emitted_total{valid="false"}`. Consumers should surface errors to observability dashboards.

## Dedupe & Smoke Alignment

- `scripts/smoke/boundary-smoke.mjs` now validates that boundary law snapshots expose a unique `eventKey` for every entry; duplicates or missing keys fail the smoke.
- When emitting boundary events from a new bridge, derive `eventKey` deterministically (e.g., `${source}:${ruleId}:${verdict}`) and persist it alongside the snapshot/export. Standard-JS-Bridges übernehmen den HTTP-Header nun automatisch, andere Implementierungen prüfen.

## Follow-up Hooks

- Add integrations that still call legacy publishers to this runbook and migrate them to `publishSigilMessage`.
- Update this document whenever a new schema version or additional observability labels are introduced.
