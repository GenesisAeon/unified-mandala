# DevTalk104 Evaluation – Verify-Gate Idempotency & Ethics Token Guard

## Kontext

- **Quelle**: `DevTalk.txt` (Fraktal104) – Folgestufe nach Defense-in-Depth: Idempotency & Replay-Schutz, signiertes Verdict-Token, SSRF-Rebinding-Hardening, Lifeboat-Erweiterungen, Log-Sampling, Evidenz-Qualität, Chaos-Proben & Dashboards.
- **Fragestellung**: Welche Punkte der Liste wurden umgesetzt? Wo bestehen Rest-Hooks?
- **Ziel**: Dokumentation des aktuellen Standes, offene Aufgaben, empfohlene Checks.

## Abgleich mit DevTalk-Schwerpunkten

| Bereich                    | DevTalk-Empfehlung                                                          | Umsetzung & Status                                                                                                                                                                                                     | Folgeaktionen                                                                                       |
| -------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Idempotency & Replay       | Verify-Gate soll doppelte Posts blocken (`idempotency-key` / 409).          | `apps/verify-gate/src/index.ts` + neues Modul `idempotency.ts` speichern Request-IDs (`VERIFY_GATE_IDEMP_TTL_MS`), Duplikate → 409 mit gleicher `x-request-id`. Tests (`idempotency.test.ts`) decken Pfad ab.          | Beobachtung: TTL-Metriken & Cache-Größe ggf. in Metrics/Grafana aufnehmen.                          |
| Token Guard                | JWT-Verdict (`VERIFY_GATE_JWT_SECRET`), Upstream erzwingt `x-ethics-token`. | `verdictToken.ts` signiert JWT (sha1(Method:Path)), `apps/api` nutzt `verifyEthics`-Middleware, Tests (`ethics-token-guard.test.ts`, `chat-success.test.ts`). Verify-Gate forwarded Header, `/readyz` prüft Allowlist. | Secret-Rotation + Clock-Skew-Handling (exp/iat) dokumentieren.                                      |
| SSRF & Pinned Agent        | DNS-Rebinding verhindern, Host preserved.                                   | `security/agent.ts` (undici Agent) fixiert IP, `buildUpstreamHeaders` setzt `host`, `VERIFY_GATE_ALLOW_PROTOCOLS` steuert Protokolle. `/readyz` failt wenn Allowlist leer oder Ethics down.                            | Optional: Metrics für Idempotency-Hits & Agent-Fehler in Prometheus ergänzen.                       |
| Ethics Evidence & Lifeboat | Mindestens zwei PSL-Domains, starke Evidenz markieren, Lifeboat erweitern.  | tldts-basierte PSL (`effectiveDomain`), `strength: 'strong'` für DOI/arXiv/Gov, Lifeboat-Regeln für Payment-Scam, Malware, Impersonation. `neededEvidence` fallback → `second independent domain`.                     | UI-Badge/Filter für `strength === 'strong'` + Alerting bei wiederholten Lifeboat-Hits.              |
| Log Sampling               | 100% rot/gelb, 1% grün.                                                     | `LOG_SAMPLE_GREEN` (default 0.01) steuert Sampling; Logs enthalten `evidenceDomains`.                                                                                                                                  | Sampling-Metrik + konfigurierbare Seeds für deterministische Tests prüfen.                          |
| OPA Hook                   | Policy-as-Code optional, fail-closed.                                       | Neues Modul `apps/ethics-api/src/opa.ts` ruft `opa eval` (Timeout, fail-closed). Fehlende Config → Skip.                                                                                                               | CI-/Bundle-Integration (`ETHICS_OPA_BUNDLE` Verteilung), Observability für OPA-Ergebnisse ergänzen. |
| Chaos-Proben               | Skript `pnpm chaos:ethics`.                                                 | Neues Skript `scripts/chaos/ethics-chaos.mjs` führt Baseline/Bndry/Ethics-Proben (manuelle Trigger) aus, liefert JSON-Summary.                                                                                         | Automatisierung: Chaos-Lauf in Nightly CI integrieren, Boundary/Ethics Toggle automatisieren.       |
| Dashboards                 | Quick-Panels für neue Metriken.                                             | MandalaMap & Docs verweisen auf offene Grafana-Erweiterung; Panels noch TODO.                                                                                                                                          | Grafana Dashboard aktualisieren (Idempotency Hits, SSRF-Blocks, Token failures).                    |

## Umsetzung dieses Laufs

1. **Verify-Gate** – Idempotency-Cache, JWT-Signatur, IP-Pinning-Agent, erweitertes `/readyz`, aktualisierte Tests.
2. **Ethics-API** – PSL-Domain-Detektion, starke Evidenz, Lifeboat-Erweiterung, Log-Sampling, `boundary_cache_warm`, optionaler OPA-Hook.
3. **Upstream/API** – Middleware `verifyEthics`, Token-Gate-Tests, Supertest-Anpassungen.
4. **Chaos & Tooling** – neues `pnpm chaos:ethics`, `.env.example` Variablen, Stabilization-Playbook/MandalaMap aktualisiert, DevTalk-Log erstellt.

## Offene Aufgaben (Hooks)

- **OPA Delivery** – Bundle/CLI in CI verankern, Artefakt bereitstellen, Chaos-Script optional automatisieren.
- **Grafana/Alerts** – Panels für Idempotency, Token-Fail, OPA-Deny + Alert-Regeln.
- **Ethics UI** – Strong-Evidence-Badge & Sampling-Stats visualisieren.
- **Telemetry** – Idempotency/Token counters als Prometheus-Metriken ergänzen.

## Empfehlung für nächste Schritte

- `pnpm vitest run apps/verify-gate/src/__tests__/idempotency.test.ts apps/api/src/__tests__/ethics-token-guard.test.ts tests/api/chat-success.test.ts`
- Chaos-Probe durchführen (`pnpm chaos:ethics`) mit Boundary-/Ethics-Stop, Ergebnisse dokumentieren.
- Grafana Dashboard & Alerting-Playbook updaten, OPA-Bundle-Verteilung planen.

## Status

- Fraktal104 umgesetzt: Verify-Gate Idempotency & Token Guard aktiv, Ethics-API liefert PSL-basierte Evidenz + OPA-Hook. OPA-Bundle/Grafana/Strong-Evidence-UI als nächste Schritte.
