# Fraktal41 · CI- und Governance-Härtung

## Überblick

Fraktal41 setzt den Stabilisierungspfad aus Fraktal40 fort. Ziel ist es,
alle Pflichtläufe fail-fast zu gestalten, Governance-Prüfungen zu
vereinheitlichen und Dist-First-Grundsätze in den Build- und
Betriebsroutinen zu verankern. Die Arbeiten fokussieren sich auf drei
Schwerpunkte:

1. **Pipeline-Robustheit** – Core-, Extended- und Experimental-CI
   erhalten konsistente Toolchains, zusätzliche Code-Quality-Gates und
   Coverage-Signale.
2. **Policy-Suite-Kohärenz** – OPA, Guardrails und Kyverno liefern einen
   gemeinsamen Statusbericht, der in CI-Checks den Merge blockiert.
3. **Onboarding & Monitoring** – Dokumentation, Compose-Profile und
   Feedback-Tracker spiegeln den neuen Workflow wider.

## Ergebnisse

### 1. CI/CD & Build-Pipelines

- **CI Core** protokolliert Node/Pnpm/Python-Versionen, führt
  Format-/Lint-Kontrollen sowie Vitest-, Pytest- und Pyright-Läufe ohne
  Toleranzpfade aus.
- **CI Extended** läuft jede Nacht oder über das Label
  `run-extended`, nutzt dieselbe Node-20-Toolchain und führt Coverage-
  Reports (`pnpm test:unit`) als dedizierten Job aus. Offline-Adapter-
  und STAC-Smokes bleiben Teil des Schedules.
- **CI Experimental** arbeitet weiterhin label-gesteuert, ruft jetzt
  `pnpm run agents:health` auf und bricht unmittelbar bei Policy- oder
  Agent-Fehlern ab. Kyverno- und Guardrails-Berichte werden als Artefakt
  gesichert.

### 2. Governance & Policy

- `policy-check.yml` wurde in einen strikten Guard verwandelt:
  `pnpm policy:check` plus Kyverno-Dry-Run laufen tolerant, der
  Abschluss-Step schlägt bei jeder Abweichung fehl und lädt gleichzeitig
  `out/policy/*` als Diagnose hoch.
- Guardrails erzwingen Dokumentations-Updates, sobald Dateien in
  `policies/` verändert werden. Die Anleitung unter
  `docs/governance/policy-suite.md` beschreibt lokale Dry-Runs.
- `AI_POLICY.md` wird um konkrete Allow/Deny-Beispiele erweitert
  (Vorarbeit erledigt, Beispiele folgen in Fraktal42).

### 3. Dist-First & Toolchain-Angleichung

- `pnpm build` erzeugt sämtliche Artefakte in `dist/`; Produktions-
  Befehle verwenden ausschließlich `node dist/...`.
- `Dockerfile.dev` und CI laufen auf Node.js 20. Für `pnpm` wird Version
  10.16.1 fixiert.
- Legacy-Kommandos mit `ts-node` bleiben markiert und werden sukzessive
  durch dist-first Alternativen ersetzt.

### 4. Observability

- Neues Compose-Profil `monitoring` aktiviert Prometheus (Port 9090) und
  Grafana (Port 3300). Konfigurationen liegen unter `observability/` und
  werden in der Dokumentation erläutert.
- Workspace-Paket `@um/health` stellt `/metrics`-Endpoints bereit; für
  nicht-Node-Services sind Sidecars geplant.

### 5. Dokumentation & Feedback

- README, Onboarding-Guide und Community-Guide beschreiben Dist-First,
  Policy-Gates und das Setup-Skript `scripts/setup-dev-env.sh`.
- `codexfeedback.*` spiegeln den Fortschritt (Fraktal41 steht auf
  „in-progress“, offene Teilziele sind notiert).
- Fraktallauf-Status wird in `docs/fraktale/fraktal41.md` festgehalten.

## Nächste Schritte (Fraktal42)

- Nightly Extended-Läufe stabilisieren und Coverage dauerhaft aktiv
  halten.
- Policy-Dokumentation um konkrete Allow-/Deny-Cases erweitern.
- Dist-First-Builds für alle Agenten- und Ghost-Shell-Skripte abschließen.
- Observability-Signale (Prometheus Targets, Grafana Dashboards) als
  CI-Smoke integrieren (`pnpm observability:check`).
