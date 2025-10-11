# Agents · Phase B – Observability, Audit, Golden

## Inhalte

- Runner schreibt Metriken: `data/agents/metrics/<agent>.jsonl` (ok, fail, duration_ms)
- Aggregation: `pnpm agents:metrics` → JSON-Report (p50/p95)
- Domain-Audit: `pnpm agents:audit:domains` → prüft harte Hosts gegen `allowed_domains`
- Golden-Tests: deterministische Agent-Ausgaben gegen `tests/agents/golden/<agentId>/{input,expected}.json`

## Verwendung

```bash
pnpm agents:health
pnpm agents:metrics
pnpm agents:audit:domains
pnpm agents:test:golden
```

## Hinweise

- Golden-Runner verhindert HTTP-Aufrufe. Falls nötig: Mocken & Fixture erweitern.
- Policies: per-Agent Overrides unter `agents:` in `governance/policies/agents-policy.yaml`.
