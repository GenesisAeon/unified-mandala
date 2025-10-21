# Codexfeedback – Fraktal 114 OPA Test Hardening

- Phase: OPA Test Runner Refresh
- Status: Rego-Tests nutzen valide `with input as …` Konstrukte, und der Test-Runner pinnt das lokale OPA-Binary mit Pretty/Verbose-Ausgabe.
- Next Hook: Optional OPA-Bundle-/Alertmanager-Doku synchronisieren; MandalaMap-Update nur erforderlich, falls weitere Policy-Artefakte folgen.
  What changed
- `apps/ethics-api/opa/policy_test.rego` modelliert Eingaben über `object.union` statt `with input.default`, sodass OPA 0.66 Parserfehler vermeidet.
- `scripts/opa/run-opa-test.mjs` verwendet `spawnSync` + `--format pretty --verbose` und bevorzugt `bin/opa` (Fallback PATH).
- `package.json` ergänzt `pnpm opa:fmt` & `pnpm opa:lint`, beide mit Windows-fähiger Shell und Fehler-Exit.
  Validate
- Policy/OPA: `pnpm opa:test` (lokal oder CI mit bereitgestellter Binary).
