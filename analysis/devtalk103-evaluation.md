# DevTalk103 Evaluation – Verify-Gate Defense-in-Depth & Ethics Degraded Mode

## Kontext

- **Quelle**: `DevTalk.txt` Follow-up (Fraktal103) – Defense-in-depth für Verify-Gate & Ethics-API nach initialer Hardening-Runde.
- **Fragestellung**: Wie schließen wir Restlücken (spoofbare Header, SSRF, degradierte Signale, Evidenz-Qualität) und stärken Observability?
- **Ziel**: Bewertung der empfohlenen Maßnahmen, dokumentierte Umsetzung, verbleibende Hooks.

## Abgleich mit DevTalk-Schwerpunkten

| Bereich                | DevTalk-Empfehlung                           | Umsetzung & Status                                                                                                                                                                                                                                                                     | Folgeaktionen                                 |
| ---------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Verify-Gate Hygiene    | Header-Sanitisierung, DNS-Allowlist, Metrics | Header-Drop-Liste (`connection`, `host`, `x-request-id` etc.), `VERIFY_GATE_UPSTREAM_ALLOWLIST` mit DNS-Check (`assertAllowed`), Prometheus (`verify_gate_inflight`, `verify_gate_upstream_duration_ms`, `verify_gate_http_responses_total`) + `/metrics`, Tests für Streaming & SSRF. | Alert-Regeln auf neue Gauge/Counter ableiten. |
| Ethics Degraded Mode   | Fail-closed sichtbar, lokale Regeln, Cache   | `x-ethics-degraded` + Counter `ethics_degraded_total`, Lifeboat-Regeln (Hate/PII/Scam), Boundary-Cache (`ETHICS_CACHE_TTL_MS`) mit SHA1-Key, gehashte Decision-Logs (`hashDecisionPayload`).                                                                                           | Boundary-Cache Telemetrie (Hit/Miss) erwägen. |
| Evidenzqualität        | Unique-Domain Requirement, Canonical URLs    | `canonicalizeCitations` + `ETHICS_REQUIRE_UNIQUE_EVIDENCE_DOMAINS`, Counter `ethics_evidence_domains_total`, Verdict `insufficient_unique_domains` + gelbe Antwort + neue Tests.                                                                                                       | DOI/Handle-Validator ergänzen.                |
| Traceability & Logging | Traceparent/Tracestate forwarden, redaction  | `ensureTraceContext` erzeugt/aktualisiert Trace IDs, forwardet zu Boundary/RAG, Responses liefern Trace-Header; Decision-Logs speichern nur Hash + RequestID + Verdict.                                                                                                                | Trace-Kontext in Grafana/Logs verlinken.      |

## Umsetzung dieses Laufs

1. **Verify-Gate** – neue Module `http/headerForward.ts`, `security/ssrf.ts`, Prometheus-Middleware, `/metrics`, Tests (`proxy-headers`, `streaming-preserves-headers`, `ssrf-allowlist`).
2. **Ethics-API** – Lifeboat-Regeln, Boundary-Cache, degradierte Header, Trace-Propagation, Domain-Dedupe, Decision-Log-Metriken, Tests (Failclosed erweitert, Unique-Domains, Lifeboat).
3. **Docs & Env** – `.env.example` Variablen (`VERIFY_GATE_JSON_LIMIT`, `VERIFY_GATE_RPS`, `VERIFY_GATE_UPSTREAM_ALLOWLIST`, `ETHICS_CACHE_TTL_MS`, `ETHICS_REQUIRE_UNIQUE_EVIDENCE_DOMAINS`), Stabilization-Playbook (MD/YAML) & MandalaMap.\* aktualisiert, neues DevTalk-Log.
4. **Codexfeedback** – Fraktal103 Eintrag (Defense-in-Depth), updated latest.\*, Hook auf Alerting & DOI-Validator.

## Offene Aufgaben (Hooks)

- **Alerting & Dashboards** – neue Gauge/Counter (`verify_gate_inflight`, `ethics_degraded_total`, `ethics_decision_log_total`) in Grafana integrieren, Alerts für längere Degraded-Phasen/SSRF-Drops definieren.
- **Evidence Strength** – DOI/Handle-Validator & UI-Badge für "starke Quelle" ergänzen.
- **Cache Observability** – Boundary-Cache Hit/Miss Counter + TTL-Debug Logging, optional `/metrics`-Expose.

## Empfehlung für nächste Schritte

- `pnpm vitest run apps/verify-gate/src/__tests__/proxy-headers.test.ts apps/verify-gate/src/__tests__/streaming-preserves-headers.test.ts apps/verify-gate/src/__tests__/ssrf-allowlist.test.ts apps/ethics-api/src/__tests__/ethics-failclosed.test.ts`
- Dashboard-Update: neue Verify/Ethics-Metriken importieren, Alerts konfigurieren.
- DOI/Handle-Regeln vorbereiten (Validator + Tests), UI-Hinweise planen.

## Status

- Fraktal103 umgesetzt: Verify-Gate & Ethics-API besitzen Defense-in-Depth (Header-Sanitizing, DNS-SSRF, degraded Signals, Evidenz-Dedupe), Telemetrie erweitert; Alerting/Dashboard/DOI-Checks bleiben offen.
