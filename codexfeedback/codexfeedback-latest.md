# Codexfeedback – Fraktal 116 CI Badges & Coverage Gate Hardening

- Phase: CI Badges & OPA Coverage Gate Hardening
- Status: README bündelt neue Governance-Badges und verweist auf den Primer; OPA-Coverage schlägt bei Test-Failures fehl und Nightly schreibt Chaos-/Alertmanager-Snapshots ins Job-Log.
- Next Hook: DevTalk.txt nach weiteren offenen Aufgaben (Observability-Profil, Setup-Skripte, Docs) screenen und Fraktalstatus nachführen.

  What changed

- `README.md` ergänzt CI-/Grafana-Badges, eine Dashboards-Sektion und verweist aus dem Quickstart auf Primer & Command Catalog.
- `docs/governance/primer.md` fasst Policy-Bundle, Verify-Gate-Netzwerkregeln und Coverage-Gate zusammen.
- `scripts/opa/coverage.mjs` erkennt Test-Failures sowie fehlende Coverage-Blöcke; `scripts/opa/run-opa-cover.mjs` bewahrt den `opa test` Exit-Code.
- `package.json`, `ci.core.yml` und `ci.nightly.yml` nutzen das neue Coverage-Gate, inklusive Artefakten, Bundles und Grafana-/Alertmanager-Summary.
- `tests/scripts/opa/coverage.test.ts` stellt via Vitest das Fail-Closed-Verhalten sicher.

  Validate

- Policy/OPA: `pnpm -w opa:cover`
- Regression: `pnpm test --run tests/scripts/opa/coverage.test.ts`
