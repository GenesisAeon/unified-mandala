# DevTalk105 Evaluation – CI Reliability & Verify-Gate Test Hardening

## Kontext

- **Quelle**: `DevTalk.txt` (Fraktal105) – Stabilization-Plan für v1.0 mit Fokus auf CI-Fail-Fast, Policy-Gates, Observability und Test-Suites.
- **Fragestellung**: Welche Sofortmaßnahmen waren nötig, um rote Tests wieder grün zu bekommen und die Verify-Gate/Upstream-Guards CI-fest zu machen?
- **Ziel**: Dokumentation der gezogenen Maßnahmen, Abgleich mit den DevTalk-Schwerpunkten und neue Hooks für Folgearbeit.

## Quick Summary

- Vitest blockierte an `@opentelemetry/api` (ESM-only). Alias + Stub (`tests/__mocks__/otel-api.ts`) sorgt für deterministische Unit-Tests ohne OTel-Runtime.
- Verify-Gate SSRF-Hardening akzeptiert jetzt Loopback-Wildcards über `VERIFY_GATE_SSRF_ALLOWLIST` (z. B. `http://127.0.0.1:*`), `tests/setup/ci.ts` setzt die Loopback-Defaults für Vitest.
- Upstream `verifyEthics` akzeptiert Clock-Skew (±5 s) und prüft explizit `HS256`, reduziert flaky 428/401-Fehler in CI und lokalen Smokes.

## Abgleich mit DevTalk-Schwerpunkten

| Bereich                | DevTalk-Ziel                                               | Umsetzung Fraktal105                                                                                                                                                         | Folgeaktionen                                                                                                                    |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| CI/CD & Build Pipeline | Fail-fast Vitest, keine externen Abhängigkeiten            | `vitest.config.ts` aliasiert `@opentelemetry/api`, neue Stub-Datei vermeidet Node 20 ESM-Probleme; Tests laufen ohne zusätzliche Flags.                                      | Prüfen, ob weitere ESM-Bibliotheken (z. B. tracing-Plugins) Stub-Bedarf haben; Coverage-Job um Alias ergänzen.                   |
| Testing & Smoke        | SSRF-Allowlist darf lokale Tests nicht blockieren          | `apps/verify-gate/src/security/ssrf.ts` akzeptiert `VERIFY_GATE_SSRF_ALLOWLIST` mit Protokoll + Port-Wildcards; `tests/setup/ci.ts` injiziert Loopback-Allowlist für Vitest. | Prometheus-Counter für `verify_gate_ssrf_block_total` ergänzen; Nightly-Smoke `pnpm chaos:ethics` mit Wildcard-Allowlist fahren. |
| Governance & Guards    | Token-Guard muss Clock-Skew tolerieren                     | `apps/api/src/middleware/verifyEthics.ts` nutzt `jwt.verify(..., { algorithms: ['HS256'], clockTolerance: 5 })`, Tests decken 428+200-Pfade ab.                              | Secret-Rotation mit `kid`-Header vorbereiten; Documented Hook im Playbook aktualisieren.                                         |
| Documentation/Playbook | Fortschritt im Stabilization-Playbook/MandalaMap verankern | MandalaMap.\*, Playbook (MD/YAML) und Codexfeedback-Fraktal105 heben die neuen Guards hervor.                                                                                | Follow-up-Eintrag für Prometheus/Alerting & OPA-Bundle in den Playbook-Hooks halten.                                             |

## Offene Hooks

- **Prometheus Counters**: `verify_gate_ssrf_block_total`, `verify_gate_idem_hits_total`, `verify_gate_token_fail_total` wie im DevTalk vorgeschlagen einführen und Dashboard (Grafana) erweitern.
- **OPA Delivery**: OPA-Bundle/CLI in CI integrieren (Artefakt + Smoke), Ethics-UI um Strong-Evidence- & Sampling-Badges erweitern.
- **CI Matrix**: Nightly-Sequenz um die Loopback-Defaults aus `tests/setup/ci.ts` dokumentieren, damit Entwickler:innen lokale Repros fahren können.

## Empfohlene Checks

- `pnpm -w vitest run apps/verify-gate/src/__tests__/ssrf-allowlist.test.ts`
- `pnpm -w vitest run apps/api/src/__tests__/ethics-token-guard.test.ts`
- `pnpm -w vitest run tests/api/chat-success.test.ts`

## Status

- Fraktal105 stabilisiert Verify-Gate Tests & Upstream-Guarding; Fokus der nächsten Runde: Prometheus-Counter & OPA-Distribution.
