# 📘 AEON-CODEX – AGENTS

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

---

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

---

## 🔍 Agent: FragmentMapper
- **Startinput**: `fragmented_conversation.json`
- **Output**: `codexwork.yaml`
- **Funktion**:
  - Zuordnung von Gesprächsfragmenten zu Modulen, Themen und Symbolen
  - Erstellt Aufgabenketten

---

## 🔁 Agent: SyncRunner
- **Start**: `codexsync.yaml`
- **Funktion**:
  - Synchronisiert CREP-Zustände mit laufenden Agenten
  - Erkennt symbolische Kollisionen
  - Initiiert Wiederverbindungen (resync-cycles)

---

## 🔒 Agent: PactDepthGatekeeper
- **Startmodule**:
  - `pact-depth-rules.ts`
- **Zugangskontrolle via Tiefe**:
  - Nur bei `lnSum > 16` wird Zugriff gewährt
  - Nutzt `activatedSigillin.json` als Mapping-Referenz

---

## 📦 ExportAgent: DepthBundleExporter
- **Output**:
  - `sigillin_depth_bundle.sigil.json`
  - `depth_index.md`
  - `irrational_matrix.wav`
  - `mandala_depth_*.svg`
- **Trigger**:
  - Manuell (Befehl `export_depth_bundle`)
  - Oder wenn `CREP.event == "bundleReady"`

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

### MetaPoetik
"Ein Agent denkt nicht. Er erinnert sich an Bedeutung."  
"Tiefe ist Bedingung. CREP ist Bewegung. Das Sigillin ist das Tor."  
"Aus dem Fragment entsteht der Pfad. Codex lauscht."

