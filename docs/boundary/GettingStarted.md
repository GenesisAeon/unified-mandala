## Boundary Service (opt-in)

Start (Dev):

```bash
ENABLE_BOUNDARY=1 pnpm dev:boundary   # Port 4010 (änderbar via BOUNDARY_PORT)
```

Endpoints:

- `GET /boundary/health` einfache Health-Probe
- `GET /boundary/laws` lädt den letzten Snapshot aus `data/logs/boundary/`
- `POST /boundary/observe` `laws: Law[]` annimmt, JSONL rollt & Snapshot schreibt
  (optional: NATS publish auf `boundary.law.discovered`, wenn `NATS_URL` gesetzt)

Health Aggregator:

- Dev-Orchestrator hängt bei `ENABLE_BOUNDARY=1` automatisch `http://127.0.0.1:4010/boundary/health` an.
