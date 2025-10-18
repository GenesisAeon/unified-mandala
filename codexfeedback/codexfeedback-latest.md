# Codexfeedback – Fraktal 99

- Phase: Ethics fail-closed & Verify-Gate Header Forwarding
- Status: Ethics-API nutzt einen Circuit-Breaker samt Fail-Closed-Antwort (`ETHICS_DEP_FAIL_MODE`), zählt `ethics_dependency_unreachable_total`, exponiert das Gauge `boundary_circuit_state`, bietet `/readyz` und ruft Boundary/RAG über einen geteilten `fetchJson`-Client mit Timeout/Retry. Das Verify-Gate reicht Authorization/Cookie-Header durch, setzt `x-ethics-verdict`/`x-ethics-evidence-count`, filtert Hop-by-Hop-Header und liefert 5xx, wenn der Ethics-Check scheitert. Vitest/Supertest decken Fail-Closed- sowie Header-Forwarding-Pfade ab; `.env.example`, Stabilization-Playbook und MandalaMap.\* spiegeln die neuen Envs/Metriken.
- Next Hook: Rate-Limits & Allowlist/Alerting für Verify-/Ethics-Gates prüfen (Boundary-Alert-Dashboards, SSRF-Gates, Circuit-Open-Alarmierung).

What changed

- `apps/ethics-api/src/index.ts` · Circuit-Breaker Hook, Fail-Closed-Response, `/readyz`, Metrics (`ethics_dependency_unreachable_total`, `boundary_circuit_state`).
- `apps/ethics-api/src/boundary-client.ts` · Shared observe-Client (Timeout/Retry) + Circuit-Breaker-Steuerung.
- `apps/ethics-api/src/circuit-breaker.ts` & `apps/ethics-api/src/http-client.ts` · Infrastruktur für Circuit-State & JSON-Fetch mit Jitter-Retry.
- `apps/verify-gate/src/index.ts` · Header-Forwarding, `x-ethics-*`-Response-Header, Timeout für Ethics-Call, Fail-Closed bei Ausfällen.
- `apps/ethics-api/src/__tests__/ethics-failclosed.test.ts` · Prüft 200/503-Fail-Closed-Verhalten inkl. ENV-Modi.
- `apps/verify-gate/src/__tests__/proxy-headers.test.ts` · Stellt Auth-/Cookie-Weitergabe und Verdict-Header sicher.
- `.env.example` · Neue Envs (`ETHICS_DEP_FAIL_MODE`, Boundary-Zeitlimits, VERIFY*GATE_TIMEOUT_MS, VERIFY*\* URLs).
- `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` · Observability-Abschnitt ergänzt Circuit-/Header-Update.
- `MandalaMap.(md|json|yaml)` · Neue Einträge für Ethics-API & Verify-Gate, aktualisierte Meta-Daten.
- `codexfeedback.(md|json|yaml)` & `codexfeedback/codexfeedback-fraktal99.yaml` · Tracker auf Fraktal99 angehoben.
- `analysis/devtalk99-evaluation.md` · DevTalk-Abgleich zum Fail-Closed/Proxy-Lauf.

Validate

- `pnpm vitest run apps/ethics-api/src/__tests__/ethics-failclosed.test.ts`
- `pnpm vitest run apps/verify-gate/src/__tests__/proxy-headers.test.ts`

Refs

- apps/ethics-api/src/index.ts
- apps/ethics-api/src/boundary-client.ts
- apps/ethics-api/src/circuit-breaker.ts
- apps/ethics-api/src/http-client.ts
- apps/verify-gate/src/index.ts
- apps/ethics-api/src/**tests**/ethics-failclosed.test.ts
- apps/verify-gate/src/**tests**/proxy-headers.test.ts
- .env.example
- docs/roadmap/v1.0-stabilization-playbook.md
- docs/roadmap/v1.0-stabilization-playbook.yaml
- MandalaMap.(md|json|yaml)
- codexfeedback.(md|json|yaml)
- analysis/devtalk99-evaluation.md
