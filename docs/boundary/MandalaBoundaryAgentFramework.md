# Mandala Boundary Agent Framework

Dieses Dokument skizziert einen Blueprint für die Einrichtung von Boundary-Laws und zugehörigen Agenten im Unified Mandala.

## Ziel
- Klares Regelwerk für Grenzen und Rechte innerhalb des Mandala-Systems
- Vorlage für Agents, die diese Boundary-Laws überwachen und durchsetzen

## Komponenten
1. **BoundaryLaw Templates**  
   YAML-Vorlagen definieren erlaubte Aktionen, Rollen und Zustände.
2. **BoundaryAgents**  
   Beobachten Systemereignisse und vergleichen sie mit den BoundaryLaw Templates.
3. **Audit Hooks**  
   Jeder BoundaryAgent protokolliert Verstöße und gibt Feedback an das CREP-System.

## Einsatz
Boundary-Laws können in `configs/boundary/*.yaml` abgelegt werden. Agents lesen diese beim Start ein und registrieren sich beim `SyncRunner`.

## Ausblick
Dieses Framework bildet den Grundstein für zukünftige Governance-Module und lässt sich mit Resonanz- und VR-Komponenten verknüpfen.
