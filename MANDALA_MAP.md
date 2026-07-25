# MANDALA_MAP.md

# Generated: 2026-07-26

# unified-mandala — Inhaltskartierung (Archäologie-Sprint, erster Durchgang)

> **Nicht zu verwechseln mit `MandalaMap.{md,json,yaml}`** im selben Repo-Root:
> jenes ist ein älteres, separates, auto-generiertes Modul-/CI-Inventar (79
> Einträge, Version 1.0, generiert 2025-12-01, Kategorien wie
> automation/governance/ci-infra/core-runtime/agents/observability/support/
> data-intel/research/testing/backlog — es beschreibt, welche
> Werkzeuge/CI-Bausteine es gibt). Dieses Dokument hier ist eine andere,
> komplementäre Kartierung: **Inhalts-Archäologie** — für jeden gefundenen
> Cluster eine Migrations-/Erhaltungs-Entscheidung (migriert / Paket-Kandidat /
> Blueprint / Log / veraltet / unklar).

**Wichtiger Hinweis zum Umfang:** `unified-mandala` hat mehrere tausend
Dateien über Dutzende Top-Level-Verzeichnisse. Eine erschöpfende
datei-für-datei-Klassifikation war in einem Durchgang nicht seriös möglich.
Diese Karte klassifiziert auf **Verzeichnis-/Cluster-Ebene** mit
Stichproben-Verifikation (Zeilenzahl, Klassen/Funktionen, echte vs.
Platzhalter-Logik) und markiert explizit, was noch tiefere Prüfung braucht.
Konservativ klassifiziert: nichts als Paket-Kandidat markiert ohne echten,
lauffähigen Code mit echter Logik.

---

## Legende

| Symbol            | Bedeutung                                                                |
| ----------------- | ------------------------------------------------------------------------ |
| 🟢 MIGRIERT       | Code existiert (mutmaßlich) bereits als eigenständiges GenesisAeon-Paket |
| 🔵 PAKET_KANDIDAT | Hat echten Code, könnte eigenes Paket werden                             |
| 📋 BLUEPRINT      | Konzept dokumentiert, noch kein/kaum lauffähiger Code                    |
| 📜 LOG            | Gesprächshistorie / Kollaborationsprotokoll                              |
| 🔴 VERALTET       | Superseded durch neuere Implementierung                                  |
| ❓ UNKLAR         | Braucht manuelle/tiefere Entscheidung                                    |

---

## Strukturüberblick

Top-Level-Verzeichnisse (Auswahl, ohne `.git`/`node_modules`/`dist`/`out`/
`.venv`/`build`): `.github`, `.husky`, `.registry`, `GenesisAeonAdvancedAi`,
`GenesisAeonZIPMEM`, `advancedToDo_parts`, `agents`, `analysis`, `apps`,
`aws`, `charts`, `ci`, `codex`, `codex-sync`, `codexbuild`, `codexfeedback`,
`config`, `cypress`, `data`, `demos`, `deployment`, `docs`, `examples`,
`experiments`, `fixtures`, `fraktalrun`, `go-agent`, `go-bridge`,
`governance`, `grafana`, `infrastructure`, `ingest`, `integration`, `k8s`,
`keys`, `manifest`, `observability`, `orchestrator`, `packages` (~140
pnpm-Workspace-Pakete), `pipelines`, `plugins`, `policies`, `processes`,
`prompts`, `public`, `runners`, `schemas`, `scripts`, `services`, `sigils`,
`sims`, `simulations`, `src`, `stubs`, `tests`, `tools`, `types`,
`unifiedmandala-neural`, `unifiedmandala-orchestrator`, `validation`,
`worldview`.

Datei-Typen (Top): 1834 `.ts`, 548 `.yaml`, 410 `.tsx`, 397 `.py`, 356 `.md`,
330 `.patch`, 292 `.html`, 216 `.json`, 122 `.js`, 122 `.go`, 108 `.mjs`.

**`src/`, `apps/`, `packages/` (~140 Workspace-Pakete), `scripts/`** sind der
**aktive, laufende Code dieses Repos selbst** — nicht Archäologie-Material,
sondern unified-mandalas eigene, fortlaufende Rolle als Monorepo/
Inter-AI-Bridge (siehe Zenodo-Eintrag). Bleibt unangetastet, nicht Teil der
Migrations-/Extraktionsbetrachtung.

---

## 🟢 Bereits migrierte Module (Verdachtsfälle, nicht abschließend geprüft)

| Datei/Ordner                       | Migriert nach (Verdacht)   | Notiz                                                                                                                                |
| ---------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `worldview/mandala-worldview.yaml` | `worldview` (eigenes Repo) | Nur eine einzelne YAML-Konfigdatei übrig, kein Code mehr hier — spricht für vollständige Migration, aber nicht per Diff verifiziert. |

Eine belastbare MIGRIERT-Liste braucht einen Datei-Hash-/Namens-Abgleich
gegen alle ~52 Ökosystem-Repos — das ist ein eigener, größerer Task (nicht
in diesem Durchgang gemacht).

---

## 🔵 Paket-Kandidaten

| Cluster                                                                                                                                           | Zeilen (Kern)                                                                                                             | Konzept                                                                                                                                                                                                                                                                                                                                | Empfehlung                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unifiedmandala-neural/` + `unifiedmandala-orchestrator/`                                                                                         | ~150 Python + `server.ts`                                                                                                 | 4 separate Docker-Microservices (GNN/HGNN, KAN-Physik-Sim, Liquid Neural Net, SNN-Haptik) plus ein Orchestrator (FastAPI `app.py` + `sigillin_scheduler.py` + Node-Server). Echter, lauffähiger Code (z. B. `gnn_hgnn/main.py`: echtes `torch_geometric`-Training), aber Demo-Reife (Loss auf Zufallszielen, keine echte Supervision). | Paket-Kandidat, aber erst nach Ausbau zu echtem Training/Datensatz sinnvoll extrahierbar. Kein bekanntes Ökosystem-Äquivalent gefunden.                                                                                                        |
| `GenesisAeonZIPMEM/{seal_core,self_organizing_memory,master_coordinator,dynamic_task_allocator,advanced_ai_system,aeon_seal_ai,fractal_agent}.py` | ~390 Zeilen gesamt                                                                                                        | "AeonSealAI" / SealCore-Cluster: `SealCore`-Klasse mit echtem Threshold-Adaptions-/Feedback-Loop (`seal_core.py`, 129 Zeilen, klar keine Stub-Logik). Sitzt aber mitten im Log-Archiv-Verzeichnis (`GenesisAeonZIPMEM`) — genau die im Prompt erwähnte hybride Struktur.                                                               | Paket-Kandidat, sollte aber zuerst aus dem Log-Verzeichnis herausgelöst werden (Verwechslungsgefahr mit den dortigen `.zip`-Logs).                                                                                                             |
| `GenesisAeonAdvancedAi/`                                                                                                                          | 38 `.py`-Dateien, davon 37 mit echten Klassen/Funktionen (`aeon_processor.py` 253 Zeilen, `advanced_agent.py` 187 Zeilen) | Größerer, ernsthafter Agenten-Prototyp (`aeon_agent.py`, `aeon_cli.py`, `aeon_web.py`, `archetype_tools.py` u. a.), begleitet von 9 Blueprint-/Konzept-Markdowns (`AeonMembraneBlueprint.md`, `AeonNeurNetzKonzeptPapier.md`, `AeonNeurNetzPublikation.md`).                                                                           | Größter gefundener Kandidat — **braucht eigene, tiefere Session**: zu groß (55 Dateien) für einen Blick im Rahmen dieses Durchgangs. Vor Extraktion prüfen, ob es mit dem bestehenden `aeon-ai`-Paket überlappt (Namensähnlichkeit auffällig). |

---

## 📋 Blueprints (Konzepte ohne/mit wenig Implementierung)

| Cluster                                                                                                        | Priorität | Nächster Schritt                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GenesisAeonAdvancedAi/AeonMembraneBlueprint.md`, `AeonNeurNetzKonzeptPapier.md`, `AeonNeurNetzPublikation.md` | Mittel    | Gegen den begleitenden Code (s. o.) abgleichen: sind das Konzepte für bereits gebauten Code, oder für Erweiterungen?                                                              |
| `analysis/devtalkNNN-evaluation.md` (27 Dateien)                                                               | Niedrig   | Sind Auswertungen/Bewertungen von `DevTalk.txt`-Abschnitten — eher log-nah als eigenständige Blueprints; brauchen eigene Sichtung ob sie Konzept- oder Rückblick-Charakter haben. |

Weitere Verzeichnisse mit Blueprint-Verdacht, aber nicht mehr geprüft in
diesem Durchgang: `experiments/` (5 Unterordner: `ab_test`,
`emergence_study`, `energy_profile`, `self_tuner`, `stress_test`),
`agents/` (32 Unterordner auf Top-Level, zusätzlich zu
`GenesisAeonZIPMEM/agents/`), `simulations/`, `sims/`, `demos/`,
`examples/`.

---

## 📜 Gesprächslogs

| Datei/Ordner                                                     | Größe                                                                                                                                          | Inhalt (grob)                                                                                                |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `DevTalk.txt` (Repo-Root)                                        | 653 KB                                                                                                                                         | Entwickler-Tagebuch/Konversationsprotokoll (bereits aus früherer Session bekannt, gehört Johann als Person). |
| `GenesisAeonZIPMEM/newadvancedconversations.zip`                 | 20 MB                                                                                                                                          | Gezipptes Konversationsarchiv.                                                                               |
| `GenesisAeonZIPMEM/conversations.zip`                            | 20 MB                                                                                                                                          | Gezipptes Konversationsarchiv.                                                                               |
| `GenesisAeonZIPMEM/advancedconversations.zip`                    | 20 MB                                                                                                                                          | Gezipptes Konversationsarchiv.                                                                               |
| `GenesisAeonZIPMEM/commitMemory/<sha>/{changes.patch,meta.yaml}` | 1.8 MB, 137 Unterordner                                                                                                                        | Pro-Commit-Archiv (Patch + Metadaten) — Entwicklungshistorie als Dokument, kein aktiver Code.                |
| `GenesisAeonZIPMEM/newadvancedconversations/*`                   | 1.3 MB, 4 thematische Ordner (`AEON-KI-RESONANZ`, `AEON-PROJEKT-WEITERENTWICKLUNG`, `2025-0626-PFADVERBUNDUNG`, `Sigil-Uebergang-und-Kontext`) | Themen-sortierte Gesprächsauszüge.                                                                           |
| `analysis/conversations.filtered.{csv,json}`                     | —                                                                                                                                              | Gefilterte/aufbereitete Gesprächsdaten.                                                                      |

Kein Inhalt dieser Logs wurde gelesen (nur Größen/Struktur) — wie in den
Hinweisen des Prompts gefordert.

---

## 🔴 Veraltete / Superseded Inhalte

Kein Cluster in diesem Durchgang mit ausreichender Sicherheit als veraltet
identifiziert. Eine echte Veraltet-Bewertung braucht den MIGRIERT-Abgleich
(s. o.) als Voraussetzung — ohne den lässt sich "superseded" nicht von
"noch nicht extrahiert" unterscheiden.

---

## ❓ Manuelle Entscheidungen nötig

| Cluster                                                                                               | Warum unklar                                                                          | Optionen                                                                   |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `GenesisAeonAdvancedAi/` (gesamt)                                                                     | Zu groß für diesen Durchgang; Überlappung mit `aeon-ai`-Paket unklar                  | Eigene Session: Diff gegen `aeon-ai`, dann neu klassifizieren              |
| `experiments/`, `agents/` (Top-Level, 32 Unterordner), `simulations/`, `sims/`, `demos/`, `examples/` | Noch nicht inhaltlich gesichtet                                                       | Nächster Durchgang: gleiche Heuristik (Zeilen/Klassen/Funktionen) anwenden |
| `go-agent/`, `go-bridge/` (122 `.go`-Dateien insgesamt im Repo)                                       | Go-Code nicht mit den Python-Heuristiken des Prompts geprüft                          | Eigene Go-spezifische Sichtung                                             |
| MIGRIERT-Status generell                                                                              | Ohne Datei-Hash-/Namens-Diff gegen alle ~52 Ökosystem-Repos nicht seriös feststellbar | Dedizierter Abgleichs-Task                                                 |

---

## Empfohlene nächste Schritte (nach Priorität)

1. **Sofort:** `GenesisAeonAdvancedAi/` gegen das bestehende `aeon-ai`-Paket
   abgleichen (Namensüberlappung, 38 Python-Dateien mit echter Logik) — der
   mit Abstand größte gefundene Kandidat.
2. **Kurzfristig:** `GenesisAeonZIPMEM`'s SealCore-Cluster (7 Dateien, echte
   Logik) aus dem Log-Verzeichnis lösen, bevor er versehentlich mit den
   Konversations-Zips mitgelöscht/übersehen wird.
3. **Mittelfristig:** verbleibende ungesichtete Cluster (`experiments/`,
   `agents/`, `simulations/`, `sims/`, `demos/`, `examples/`, Go-Code)
   in einem Folge-Durchgang mit derselben Heuristik prüfen.

---

## Statistik (Cluster-Ebene, nicht datei-genau)

| Kategorie                     | Anzahl Cluster |
| ----------------------------- | -------------- |
| MIGRIERT (Verdacht)           | 1              |
| PAKET_KANDIDAT                | 3              |
| BLUEPRINT                     | 2              |
| LOG                           | 6              |
| VERALTET                      | 0              |
| UNKLAR                        | 4              |
| **Gesamt (dieser Durchgang)** | **16**         |

Dies ist explizit **kein vollständiger Datei-Zensus** — siehe Hinweis zum
Umfang oben. Große Teile des Repos (insbesondere `experiments/`, die 32
Top-Level-Agenten-Ordner, `simulations/`/`sims/`, Go-Code) sind noch nicht
im Detail gesichtet.
