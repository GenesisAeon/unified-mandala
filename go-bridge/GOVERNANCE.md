# go-bridge — Governance

## Rolle im GenesisAeon-Ökosystem

`go-bridge` (Modulpfad `github.com/GenesisAeon/unifiedmandala-go`,
Repo-Verzeichnis `go-bridge/`) ist laut eigenem `README.md` ein
"polyglottes Interface zu UnifiedMandala": REST- und gRPC-Clients, ein
NATS-EventBus-Consumer und ein CLI (`mandala-cli`), gedacht auch als
SDK für externe Projekte (`go install .../mandala-cli@latest`).

Verifiziert durch Lektüre (nicht nur README):

- **Real und verifiziert gegen eine tatsächlich existierende API**:
  `mandala-cli meta-scores get` ruft `GET {api}/api/meta-scores` auf
  (`api/rest_client.go`). Dieser Endpoint existiert wirklich — bestätigt
  per Grep gegen `apps/sharedream-interface/pages/api/meta-scores.ts`
  (Next.js-Route) und den zugehörigen React-Hook
  `apps/sharedream-interface/hooks/useMetaScores.ts`. Das ist also eine
  echte, funktionierende Integration mit dem **Node/TypeScript**-Teil
  dieses Monorepos — nicht mit einem Python-Paket.
- **Real, aber ohne verifizierten Produzenten**: `mandala-cli crep watch`
  abonniert das NATS-Subject `crep.events` (`cmd/mandala-cli/main.go`).
  Eine repo-weite Suche nach `crep.events` findet **keine einzige Stelle**,
  die auf dieses Subject publiziert — der Consumer existiert, ein
  Producer nicht (jedenfalls nicht in diesem Repo). Entweder wird das
  Subject von einem externen/zukünftigen Dienst bespielt, oder das
  Feature ist aspirational. Nicht stillschweigend "repariert" — hier nur
  dokumentiert.
- **gRPC-Service** (`api/proto/meta.proto`): `MetaScoreService.ListMetaScores`
  — Protobuf-generierter Code vorhanden (`meta.pb.go`, `meta_grpc.pb.go`),
  aber kein verifizierter Server, der diesen Service tatsächlich
  implementiert und bindet (nur der Client-seitige Aufruf wurde
  gefunden).

## Beziehung zum restlichen Ökosystem — korrigiert gegenüber der Annahme im Auftrag

Der ursprüngliche Auftrag ging von einer Ergänzung des **Python**-
Ökosystems aus. Die tatsächlich verifizierte Gegenstelle
(`/api/meta-scores`) ist eine **Node/TypeScript**-Route in
`apps/sharedream-interface`, Teil von unified-mandalas eigenem,
aktivem Code (siehe `MANDALA_MAP.md`s Hinweis, dass `apps/` "aktiver
Code dieses Repos selbst" ist) — keine Verbindung zu den Python-
`aeon-*`/`genesis-*`-Paketen wurde gefunden.

| Aspekt       | Rest des Ökosystems                      | go-bridge                                                                                                           |
| ------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Wissenschaft | Python-Pakete: UTAC/CREP-Berechnungen    | —                                                                                                                   |
| Web-API      | `apps/sharedream-interface` (Next.js/TS) | **echte, verifizierte Integration** (`/api/meta-scores`)                                                            |
| Streaming    | —                                        | NATS `crep.events` — Consumer vorhanden, kein Producer gefunden                                                     |
| CLI          | —                                        | `mandala-cli` (`meta-scores get`, `crep watch`)                                                                     |
| Modul-Pfad   | —                                        | `github.com/GenesisAeon/unifiedmandala-go` (andere Namespace-Konvention als `go-agent`, siehe dessen GOVERNANCE.md) |
| Release      | PyPI + Zenodo (Python)                   | GitHub Releases + `go install .../mandala-cli@latest`                                                               |

## Versioning

Semantic Versioning (semver): MAJOR.MINOR.PATCH, unabhängig vom
Python-Ökosystem. Erstes dokumentiertes Release: `v0.1.0` (dieser
Commit).

## Release-Prozess

1. `git tag go-bridge/v[VERSION]` im Root-Repo (Präfix wegen Monorepo-
   Struktur).
2. GitHub Release mit Changelog-Auszug erstellen.
3. `go install github.com/GenesisAeon/unifiedmandala-go/cmd/mandala-cli@<tag>`
   funktioniert für Endnutzer sobald der Tag gepusht ist — kein
   zusätzlicher Registrierungsschritt nötig (Standard-Go-Module-Proxy).
4. Kein PyPI, kein Zenodo für dieses Go-Modul.

## Offene Fragen (nicht in dieser Session entschieden)

- `crep.events`-NATS-Subject hat einen Consumer, aber keinen
  verifizierten Producer in diesem Repo — woher soll das Signal
  kommen?
- `MetaScoreService`-gRPC-Server-Implementierung wurde nicht gefunden —
  läuft der Server woanders, oder ist der gRPC-Pfad noch nicht
  produktiv genutzt (nur der REST-Pfad läuft nachweislich)?
- Modul-Pfad-Inkonsistenz mit `go-agent` (siehe dessen GOVERNANCE.md).

## Kontakt / Maintainer

Johann Römer — MOR Research Collective
