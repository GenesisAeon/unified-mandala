# Provenance-Timeline Notizen (Repo-Forensik)

Stand: 2026-02-19

## Vorgehen (ausgeführt im Repo)

- `git log --oneline --decorate --date=short --pretty=format:'%h %ad %s'`
- `git log --reverse -S 'Mandala Climate Dashboard' -- apps/ui/src/shell/App.tsx apps/ui/index.html`
- `git log --reverse -S 'sigmoid' -- packages/simple-neural-net/util.ts packages/simple-neural-net/Network.ts packages/universum-simulationen/modules/consciousness.py`
- `git log --reverse -S 'threshold' -- GenesisAeonAdvancedAi/adaptive_threshold.py packages/agents/BewusstseinStabilizer.ts packages/agents/QuantumTheoryAgent.ts packages/aeon-neural-membrane/aeonUniversalMembrane.ts`
- `rg -uuu -ni "opik|v[_-]?rig|implosivegenesis|mikrotub" /workspace/unified-mandala`
- `python`-Scan über `docs/sigils/conversations.json` und `docs/sigils/newadvancedconversations.json` auf `v_RIG/OPIK/ImplosiveGenesis/13.5/mikrotub/Klimadashboard/kritikal/sigmoid`

## Grobe Timeline (nur aus *diesem* Repo belegbar)

1. **2025-09-15 – großer Initial-Import-Snapshot (`4ae34d7`)**  
   In diesem Snapshot sind bereits enthalten:
   - Climate-Dashboard-UI (`Mandala Climate Dashboard`)
   - Sigmoid-Funktionen in NN-Modulen
   - mehrere Threshold-/Schwellen-Mechanismen (CREP, Agenten, Membran)

2. **2025-09-23 bis 2025-10-13 – Ausbau Demo/Orchestrierung**  
   Folge-Commits an `apps/ui/src/shell/App.tsx` (u. a. cosmic-web Demo, Orchestrierung, UX-Enhancements) deuten auf Ausbau der Dashboard-/Demo-Schicht, aber nicht auf den *ersten* Ursprung von Sigmoid/Threshold.

3. **Wichtiger methodischer Vorbehalt**  
   Da der erste nachweisbare Commit bereits ein großer Import ist, kann dieses Repo den absoluten Ursprung vor `4ae34d7` nicht belegen; es belegt nur den frühesten Snapshot **im** Repo.

## Kontext: Klima-Dashboard, Sigmoid, Kritikalitätsschwellen

- **Klima-Dashboard-Kontext:** UI-Titel `Mandala Climate Dashboard` in der App-Shell, plus Blueprint zur Climate-Integration (Boundary Discovery, Dashboard, Resonanzbezug).
- **Sigmoid-Kontext:** klassische Aktivierungsfunktion in `packages/simple-neural-net` und zusätzlich in `packages/universum-simulationen/modules/consciousness.py`.
- **Schwellen/Kritikalität-Kontext:** mehrere Schwellenmodelle vorhanden (z. B. adaptive CREP-Schwelle, Agenten-Thresholds, Energie-Schwelle in der Membranlogik).

## Begriffe aus deiner Frage: Fundlage

### Begriffe ohne Treffer im Repo-Inhalt (inkl. Fulltext-Scan im aktuellen Baum)

- `V_RIG` / `v_RIG`
- `OPIK`
- `ImplosiveGenesis`
- `Mikrotub...` / `microtub...`

Für diese Begriffe gab es in den ausgeführten Scans **keinen** direkten Texttreffer.

### Begriff mit Treffern

- `13.5` / `13,5`: Treffer vorhanden, aber in den gescannten großen Konversations-Exports nicht eindeutig als stabiler physikalischer Peak-Kontext auswertbar ohne tieferes, gezieltes Parsing pro Konversationseintrag.

## Arbeitsfazit (vorläufig)

- Die These „Sigmoid + Schwellen kamen mit dem Klimadashboard“ lässt sich aus diesem Repo **nicht streng kausal** beweisen, weil alle drei bereits im selben Initial-Snapshot `4ae34d7` zusammen auftauchen.
- Belegbar ist: Klima-Dashboard, Sigmoid und Schwellenlogik sind spätestens seit dem initialen Import gemeinsam im Repo vorhanden.
- Für `V_RIG/OPIK/ImplosiveGenesis/13,5-Mikrotubuli` braucht es entweder:
  1) ein anderes Repo (z. B. von dir erwähntes `mandala`/UTACV.1), oder
  2) systematisches Extrahieren einzelner Chat-Konversationen aus den JSON-Archiven mit IDs/Timestamps.
