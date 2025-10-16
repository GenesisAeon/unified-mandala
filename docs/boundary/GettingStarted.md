## Boundary Service (opt-in)

Start (Dev):

```bash
ENABLE_BOUNDARY=1 pnpm dev:boundary   # Port 4010 (änderbar via BOUNDARY_PORT)
```

Endpoints:

- `GET /boundary/health` einfache Health-Probe
- `GET /boundary/laws` lädt den letzten Snapshot aus `data/logs/boundary/`
- `GET /boundary/status` liefert Dedupe-Kennzahlen (`dedupes_per_minute`, Cache-Größe, letzte 409)
- `POST /boundary/observe` `laws: Law[]` annimmt, JSONL rollt & Snapshot schreibt
  (optional: NATS publish auf `boundary.law.discovered`, wenn `NATS_URL` gesetzt)

### Idempotency & Curl-Beispiel

- Producer sollten einen `Idempotency-Key`-Header senden. Empfehlung: SHA1 aus
  `ruleId|source|ts|canonical(payload)` (identisch zu `stableBoundaryEventKey`).
- Boundary nimmt bei Einzel-Events auch fehlende `eventKey`-Felder an und
  kanonisiert sie automatisch.

```bash
curl -s -X POST http://127.0.0.1:4010/boundary/observe \
  -H 'Content-Type: application/json' \
  -H "Idempotency-Key: ${IDEMPOTENCY}" \
  -d '{
    "law": {
      "ts": "2025-12-08T08:00:00Z",
      "source": "smoke",
      "ruleId": "smk-1",
      "verdict": "pass",
      "severity": "ok"
    }
  }'
# → 202 + Header `Idempotency-Key: …`

curl -s -X POST http://127.0.0.1:4010/boundary/observe \
  -H 'Content-Type: application/json' \
  -H "Idempotency-Key: ${IDEMPOTENCY}" \
  -d '{"law": {"ts":"2025-12-08T08:00:00Z","source":"smoke","ruleId":"smk-1","verdict":"pass"}}'
# → 409 duplicate_eventKey, Header `Idempotency-Key: …`

curl -s http://127.0.0.1:4010/boundary/status | jq
# {"dedupe_store_size":1,"dedupes_per_minute":1,...}
```

Health Aggregator:

- Dev-Orchestrator hängt bei `ENABLE_BOUNDARY=1` automatisch `http://127.0.0.1:4010/boundary/health` an.
