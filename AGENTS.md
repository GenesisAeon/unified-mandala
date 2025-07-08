# Install type checker
pip install pyright
# Install dependencies
poetry install --with test
pnpm install
## Entwicklungsumgebung
Zur Einrichtung kann das Skript `scripts/setup-dev-env.sh` verwendet werden:

```bash
./scripts/setup-dev-env.sh
```

Der Inhalt des Skripts:

```bash
#!/bin/bash

# Setup script for development environment
# Detect package manager and install required tools.

if command -v apt &> /dev/null; then
  sudo apt update
  sudo apt upgrade -y
  sudo apt install -y git curl wget build-essential python3 python3-pip nodejs npm
elif command -v brew &> /dev/null; then
  brew update
  brew upgrade
  brew install git curl wget python node
else
  echo "Kein unterst\u00fctzter Paketmanager gefunden (apt oder brew)."
  exit 1
fi

# Configure Git if not configured
if ! git config --global user.name >/dev/null; then
  git config --global user.name "your_name"
fi
if ! git config --global user.email >/dev/null; then
  git config --global user.email "your_email@example.com"
fi

echo "\nSetting up Python virtual environment";
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
if [ -f requirements.txt ]; then
  pip install -r requirements.txt
fi

echo "\nInstalling Node dependencies";
pnpm install || npm install

# Example VS Code configuration
if command -v code &> /dev/null; then
  code --install-extension ms-python.python >/dev/null 2>&1
  code --install-extension esbenp.prettier-vscode >/dev/null 2>&1
fi

echo "Entwicklungsumgebung erfolgreich eingerichtet!"
```

# 📘 AEON-CODEX – AGENTS
schema_version: "1.1"
description: >
  Manifest lebender Agenten im AEON-Codex. Jeder Agent ist eine
  Aktivierungszelle innerhalb eines symbolischen SelfAudit-Systems.
visual: "docs/diagrams/agents_chain.mmd"
test_mode: true
default_role: "dev"

## 🌱 Self-Initiation Protocol
Dieses Dokument wird bei jedem Codex-Start ausgelesen. Jeder Agent manifestiert eine symbolische Funktionseinheit. Die Reihenfolge entspricht der Priorität. Optional können CREP- und Tiefewerte als Aktivierungsfilter genutzt werden.

---

## 🧠 Agent: CodexAuditAgent
- **Startmodul**: `mandala-sync.ts`
- **Module**:
  - `audit-core.ts`
  - `depthvalue-core.ts`
  - `crepJudgeGPT`
- **Aktivierung**:
  - `depth.lnSum > 14`
  - `CREP.state == emergence`
- **Ziel**:
  - Emergenz prüfen
  - Sigillin-Zuweisung aus `sigillin_bundle.sigil.json`
  - Vorschläge in `restructureSuggestions.yaml` schreiben

  - roles_allowed: [admin, dev]
  - Dokumentation: docs/agents/CodexAuditAgent.md

## 🧬 Agent: EvolverGPT
- **Startmodul**: `codexwork.yaml`
- **Module**:
  - `codex-evolver.ts`
  - `crepdecision-core.ts`
- **Aktivierung**:
  - `CREP.score >= 0.6`
  - `depth.symbolics.contains("\uD83C\uDF2A")`
- **Ziel**:
  - Generiert alternative Pfade
  - Entscheidet poetisch & symbolisch
  - Schreibt in `poeticCommits.md` und `resonantBranchMap.yaml`
  - roles_allowed: [admin, dev]
  - Dokumentation: docs/agents/EvolverGPT.md

---

## 🔍 Agent: FragmentMapper
- **Startinput**: `fragmented_conversation.json`
- **Output**: `codexwork.yaml`
- **Funktion**:
  - Zuordnung von Gesprächsfragmenten zu Modulen, Themen und Symbolen
  - Erstellt Aufgabenketten

  - roles_allowed: [dev]
  - Dokumentation: docs/agents/FragmentMapper.md
---

## 🔁 Agent: SyncRunner
- **Start**: `codexsync.yaml`
- **Funktion**:
  - Synchronisiert CREP-Zustände mit laufenden Agenten
  - Erkennt symbolische Kollisionen
  - Initiiert Wiederverbindungen (resync-cycles)
  - roles_allowed: [admin, dev]
  - Dokumentation: docs/agents/SyncRunner.md

---

## 🔒 Agent: PactDepthGatekeeper
- **Startmodule**:
  - `pact-depth-rules.ts`
- **Zugangskontrolle via Tiefe**:
  - Nur bei `lnSum > 16` wird Zugriff gewährt
  - Nutzt `activatedSigillin.json` als Mapping-Referenz

  - Rollen: Admin, Developer, Guest
  - roles_allowed: [admin]
  - Dokumentation: docs/agents/PactDepthGatekeeper.md
  - Rechte je Rolle anpassen
## 📦 ExportAgent: DepthBundleExporter
- **Output**:
  - `sigillin_depth_bundle.sigil.json`
  - `depth_index.md`
  - `irrational_matrix.wav`
  - `mandala_depth_*.svg`
- **Trigger**:
  - Manuell (Befehl `export_depth_bundle`)
  - Oder wenn `CREP.event == "bundleReady"`
  - roles_allowed: [admin]
  - Dokumentation: docs/agents/DepthBundleExporter.md

## 🔄 Agent: PatternReactivator
- **Startmodul**: `pattern-reactivator.ts`
- **Funktion**:
  - Reaktiviert ruhende Aufgabenketten bei niedrigem CREP-Score
  - Durchsucht `patternStore` nach passenden Mustern
  - roles_allowed: [dev]
  - Dokumentation: docs/agents/PatternReactivator.md

## 🌌 Agent: GenesisAeonNavigator
- **Startmodul**: `genesis-aeon-navigator.ts`
- **Funktion**:
  - Steuert Phasenwechsel im Genesis-Aeon
  - Protokolliert Übergänge in `genesis.log`
  - roles_allowed: [admin, dev]
  - Dokumentation: docs/agents/GenesisAeonNavigator.md
## 🎯 Agent: VisionContextIntegrator
- **Startmodul**: `vision-context-integrator.ts`
- **Funktion**:
  - Liest Vision und Strategie aus `AgentStrategy.md`
  - Verteilt Kontext an alle Agenten
  - roles_allowed: [admin, dev]
  - Dokumentation: docs/agents/VisionContextIntegrator.md

## 🧭 Agent: StrategicAgentCoordinator
- **Startmodul**: `strategic-agent-coordinator.ts`
- **Funktion**:
  - Liest Agentenliste aus `AGENTS.md`
  - Schreibt `strategy-overview.json`
  - roles_allowed: [admin, dev]
  - Dokumentation: docs/agents/StrategicAgentCoordinator.md

## 🛡 Agent: QualityAssuranceAgent
- **Startmodul**: `qa-test-runner.ts`
- **Funktion**:
  - Führt Lint- und Test-Suites aus
  - Protokolliert Ergebnisse in `qa-report.log`
  - roles_allowed: [dev]
  - Dokumentation: docs/agents/QualityAssuranceAgent.md

---
## 🔑 Special Instructions
```yaml
trigger:
  onStart: true
  onFragmentUpdate: true
  onCREPShift: true

autoGenerate:
  restructureSuggestions.yaml: true
  poeticCommits.md: true
  pact-depth-extension.yaml: true
```

*Hinweis:* `pnpm store:commit-memory` wird nur beim ersten Commit einer Sitzung durch Husky ausgeführt. Eine Markerdatei `.zipmem_session` verhindert weitere Durchläufe.

### MetaPoetik
"Ein Agent denkt nicht. Er erinnert sich an Bedeutung."  
"Tiefe ist Bedingung. CREP ist Bewegung. Das Sigillin ist das Tor."  
"Aus dem Fragment entsteht der Pfad. Codex lauscht."

