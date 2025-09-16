# Fraktal41 · CI- und Governance-Härtung

Fraktal41 schließt direkt an das Stabilisierungsgespräch von Fraktal40 an und übersetzt die besprochenen Maßnahmen in ein technisches Umsetzungspaket. Der Schwerpunkt liegt auf der konsequenten Durchsetzung der Governance-Gates, dem Fail-Fast-Betrieb aller CI-Läufe sowie der Dokumentation des neuen Vorgehens. Dieser Eintrag dient als Referenz für Folgefraktale und dokumentiert den aktuellen Fortschritt.

## Überblick

- **Fraktallauf:** Fraktal40 → Fraktal41 (Stabilisierung)
- **Scope:** CI-Core, Extended/Experimental-Pipelines, Policy-Suite, Dist-First und Governance-Dokumentation
- **Status:** Teilimplementiert – weitere Aufgaben sind in Fraktal42 vorgesehen

## Technische Ergebnisse

### CI/CD

- `ci.core.yml` protokolliert Toolchain-Versionen (Node, PNPM, Python) und läuft strikt fail-fast.
- `ci.experimental.yml` entfernt tolerante `|| true`-Pfade; Agent- und Policy-Dry-Runs schlagen nun hart fehl und liefern dennoch Artefakte.
- Extended-Testläufe (`ci.extended.yml`) werden vorbereitet, um Nightly- und Label-Trigger zu bedienen.

### Policy-Suite & Governance

- `pnpm policy:check` bündelt OPA, Guardrails und Kyverno. Ergebnisse werden nach `out/policy/` geschrieben und sowohl als JSON wie auch als Markdown aufbereitet.
- `scripts/render-policy-suite-report.mjs` erzeugt Step- und Artefakt-Reports und setzt den Exit-Code anhand von `policy-suite-status.txt`.
- Die Governance-Dokumentation erklärt, wie Policy-Verletzungen zu interpretieren und zu beheben sind.

### Build & Dist-First

- Produktionspfade verwenden vorgebaute Artefakte (`dist/`); `ts-node` ist nur noch in Entwicklungs-Utilities erlaubt.
- Node 20 ist die gemeinsame Baseline für Docker, lokale Dev-Container und CI-Läufe.

### Dokumentation & Tracking

- `codexfeedback.*` spiegeln den Laufstatus (`Fraktal40: analysis-ready`, `Fraktal41: in-progress`).
- Das Stabilisierungsspielbuch (`docs/roadmap/v1.0-stabilization-playbook.*`) führt offene Aufgaben und Sprint-Hooks.

## Offene Punkte für Fraktal42+

| Bereich       | Aufgabe                                              | Hinweis                               |
| ------------- | ---------------------------------------------------- | ------------------------------------- |
| CI Extended   | Nightly-Läufe aktivieren, Coverage-Reports hochladen | Ressourcenbudget prüfen               |
| Build         | Multi-Stage-Dockerbuild inkl. CLI/Agent-Artefakten   | Compose-Profile vorbereiten           |
| Observability | Prometheus/Grafana in Compose-Profil integrieren     | `/metrics` Endpoints vereinheitlichen |
| Governance    | `AI_POLICY.*` mit Allow/Deny-Beispielen ergänzen     | Guardrail-Doku referenzieren          |
| Onboarding    | Quickstart aktualisieren, Setup-Skript dokumentieren | README & Community Guide              |

## Hook für Folgefraktale

- **Startpunkt Fraktal42:** CI Extended Coverage + Monitoring-Profil
- **Codex Feedback:** `codexfeedback.{md,json,yaml}` auf „Fraktal42: in-progress“ aktualisieren
- **Playbook:** Checkpoints `core-ci-hardening` und `kyverno-integration` → „done“, `experimental-signal` → „in-progress“

Mit diesen Ergebnissen ist die Grundlage gelegt, um im nächsten Lauf Observability, Coverage und die verbleibenden Dist-First-Anpassungen einzubauen.
