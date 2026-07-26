# go-agent — Governance

## Rolle im GenesisAeon-Ökosystem

`go-agent` ist ein Go-basierter Daemon zur Ausführung von unified-mandala-
Tasks — laut eigenem `README.md` explizit ein **"Scaffold"** mit
"Scheduler, Dispatcher und Handler-Stubs", nicht als fertiges Produkt
gedacht. Verifiziert durch Lektüre des Codes (nicht nur des READMEs):

- **Real und funktionsfähig**: `pkg/dispatcher` (Worker-Pool mit Retry/
  Backoff, vollständig implementiert), `internal/auth` (echter
  HashiCorp-Vault-Client mit Graceful-No-Op falls nicht konfiguriert),
  `pkg/metrics` (Prometheus-Endpoint), `pkg/policy/enforcer`,
  `pkg/handler`, `pkg/plugin` (Loader + Prioritizer) — alle mit
  begleitenden `_test.go`-Dateien.
- **Explizit Platzhalter**: `pkg/scheduler.Start()`s Polling-Zweig ist
  im Code selbst als `// poll for tasks - placeholder` markiert — der
  Scheduler nimmt Tasks über einen Channel entgegen und startet sie
  sofort (`OnTask`/`Start`), das periodische Polling selbst tut nichts.

## Beziehung zum restlichen Ökosystem — korrigiert gegenüber der Annahme im Auftrag

Der ursprüngliche Auftrag ging von einer Ergänzung des **Python**-
Ökosystems aus (genesis-os, resilience-core etc.). Das stimmt nicht:
`go-agent` selbst hat keinen direkten Aufruf-/Importbezug zu einem
Python-Paket. Sein Schwester-Modul `go-bridge` (siehe eigenes
`GOVERNANCE.md`) spricht stattdessen mit einer echten **Node/TypeScript**-
API dieses Repos (`apps/sharedream-interface/pages/api/meta-scores.ts`,
verifiziert per Grep — der Endpoint existiert wirklich). `go-agent`
selbst ist eigenständiger und hat keinen verifizierten Aufrufer/
Aufgerufenen in diesem Repo — sein NATS-Scheduler und sein
`mandala-codeagent`-CLI sind funktional, aber ohne erkennbare externe
Gegenstelle im aktuellen Code.

| Aspekt       | Rest des Ökosystems                       | go-agent                                                                                                        |
| ------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Wissenschaft | Python-Pakete: UTAC/CREP-Berechnungen     | —                                                                                                               |
| Web-API      | `apps/sharedream-interface` (Next.js/TS)  | kein direkter Aufruf verifiziert                                                                                |
| Secrets      | —                                         | HashiCorp Vault (`internal/auth`), real, optional                                                               |
| Scheduling   | —                                         | NATS-basiert, Polling-Zweig ist Platzhalter                                                                     |
| Modul-Pfad   | —                                         | `github.com/unified-mandala/go-agent` (andere Namespace-Konvention als `go-bridge`, siehe dessen GOVERNANCE.md) |
| Release      | PyPI + Zenodo (Python), npm (Node-Pakete) | GitHub Releases (kein PyPI, kein npm)                                                                           |

## Versioning

Semantic Versioning (semver): MAJOR.MINOR.PATCH, unabhängig vom
Python- und Node-Ökosystem. Erstes dokumentiertes Release: `v0.1.0`
(dieser Commit — der Code selbst existierte vorher bereits ungetaggt).

## Release-Prozess

1. `git tag go-agent/v[VERSION]` im Root-Repo (Präfix wegen Monorepo-
   Struktur — `go-agent/` ist kein eigenes Git-Repo).
2. GitHub Release mit Changelog-Auszug erstellen.
3. Kein PyPI, kein npm, kein Zenodo für dieses Go-Modul — reine
   GitHub-Releases-Konvention.

## Offene Fragen (nicht in dieser Session entschieden)

- Modul-Pfad-Inkonsistenz: `go-agent` nutzt `github.com/unified-mandala/...`,
  `go-bridge` nutzt `github.com/GenesisAeon/...` — sollten beide auf
  dieselbe Organisation vereinheitlicht werden?
- Kein verifizierter Aufrufer für `go-agent`s NATS-Scheduler in diesem
  Repo — ist das absichtlich eigenständig, oder fehlt eine Integration?
- `examples/go-agent/prioritization-example.yaml` (gefunden im 3.
  MANDALA_MAP-Archäologie-Durchgang, 2026-07-26) beschreibt ein
  Job-Schema (`features.size,urgency`, `policy.tags,maxRuntime`), das
  von keinem aktuellen Go-Code geparst wird — `pkg/plugin/prioritizer.go`
  kennt nur ein einfaches `TaskInput{ID, Score}` gegen einen externen
  ML-Dienst. Ist das Beispiel Vision für ein zukünftiges Schema, oder
  veraltete Dokumentation?

## Kontakt / Maintainer

Johann Römer — MOR Research Collective
