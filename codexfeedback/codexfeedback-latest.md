# Codexfeedback – Fraktal 102

- Phase: Ethics-Gate Hardening & UI/Observability Sync
- Status: Ethics-API nutzt Ajv (`EthicsCheckSchema`), Request-ID-Middleware und Circuit-basierte `/readyz`-Bewertung (`cb` 0/1/2); optionale Service-Bearer (`INTERNAL_BEARER`) werden an Boundary/RAG weitergereicht. Verify-Gate ergänzt JSON-/Rate-Limits (`GATE_JSON_LIMIT`, `VERIFY_RATE_RPS`), SSRF-Allowlist (`VERIFY_UPSTREAM_ALLOWLIST`, `VERIFY_STRICT_SAME_HOST`), Streaming-Proxying ohne Buffering und `Access-Control-Expose-Headers` für `x-ethics-*`. Live-Smoke prüft Health, Verify-Gate, Ethics `/readyz` und Chat; UI (EthicsBadge/fetchJsonWithEthics) zeigt das Verdict unmittelbar, Grafana enthält `mandala-ethics-gate.json`.
- Next Hook: Boundary/Ethics Alerting finalisieren (Grafana-Alarme, SSRF/Gate Regressionen) und Streaming-E2E im UI testen.

What changed

- `apps/ethics-api/src/index.ts` · Ajv-Validation, Request-ID, Circuit-basierte `/readyz`, Service-Bearer Forwarding.
- `apps/verify-gate/src/index.ts` · JSON-/Rate-Limits, SSRF-Allowlist, Streaming-Proxy, `Access-Control-Expose-Headers` für Ethics-Metadaten.
- `apps/ui/src/components/MandalaAIPlayground.tsx` + `EthicsBadge` · zeigt `x-ethics-*` Verdict/Belege; neue Fetch-Wrapper (`fetchJsonWithEthics`, `streamWithEthics`).
- `scripts/smoke/live-smoke.mjs` · prüft Health-Aggregator, Verify-Gate, Ethics `/readyz` und Chat.
- `grafana/dashboards/mandala-ethics-gate.json` · Fertiges Dashboard für Verdict-, Dauer-, Failclosed- & RPS-Metriken.
- `.env.example`, Stabilization-Playbook (MD/YAML), MandalaMap (MD/JSON/YAML) & codexfeedback\* spiegeln neue Limits/Allowlists, UI/Observability-Updates.

Validate

- `pnpm vitest run apps/ethics-api/src/__tests__/ethics-failclosed.test.ts`
- `pnpm vitest run apps/verify-gate/src/__tests__/proxy-headers.test.ts`

Refs

- apps/ethics-api/src/index.ts
- apps/ethics-api/src/boundary-client.ts
- apps/ethics-api/src/http-client.ts
- apps/ethics-api/src/schemas.ts
- apps/ethics-api/src/**tests**/ethics-failclosed.test.ts
- apps/verify-gate/src/index.ts
- apps/verify-gate/src/**tests**/proxy-headers.test.ts
- apps/ui/src/components/MandalaAIPlayground.tsx
- apps/ui/src/components/EthicsBadge.tsx
- apps/ui/src/lib/fetchWithEthics.ts
- apps/ui/src/lib/streamWithEthics.ts
- scripts/smoke/live-smoke.mjs
- grafana/dashboards/mandala-ethics-gate.json
- .env.example
- docs/roadmap/v1.0-stabilization-playbook.(md|yaml)
- MandalaMap.(md|json|yaml)
- analysis/devtalk102-evaluation.md
