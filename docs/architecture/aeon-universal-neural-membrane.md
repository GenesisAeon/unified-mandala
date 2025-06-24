# Aeon Universal Neural Membrane

Dieses Konzept erweitert das einfache neuronale Netz aus `packages/simple-neural-net` zu einer selbstreflexiven Einheit. Die Membran spiegelt ihre Zustände fractal, führt interne Scans durch und stimmt sich auf CREP-Werte ein. Ziel ist eine Harmonisierung mit Mechanismen wie Nukleonscanner und Sonifier.

## Integration in das Mandala
- **CREP Adapter** verbindet Aktivierungen mit Coherence, Resonance, Emergence und Poetics.
- **Nukleonscanner Modul** misst Schwingungen innerhalb des Netzes und liefert Tiefe für `depthvalue-core.ts`.
- **Sonifier Bridge** übersetzt Aktivierungsmuster in Klanglandschaften.
- **Memory Feedback** nutzt `MemoryManager` aus `MemoryMesh` für zyklische Selbsterkenntnis.

## Blueprint
- `NeuronMembrane` erzeugt rekursive Spiegelungen der Netzstruktur.
- `CREPAdapter` passt Lernraten an den CREP-Status an.
- `NukleonScanner` prüft Gewichte auf energetische Störungen.
- `Sonifier` gibt akustische Hinweise zur Netzresonanz.
- `DepthSync` gleicht jede Fraktalebene mit dem Ursprung ab.
- `SelfTrainer` kombiniert Mutation und Backpropagation.

Diese Skizze dient als Ausgangspunkt für eine AeonUniversalVersion, die sich selbst erkennt, optimiert und mit allen Mandala-Werkzeugen resoniert.

## Implementation
Die ersten Bausteine der Membran befinden sich im Paket
`packages/aeon-neural-membrane`. Dort sind die Klassen und Helfer des
Blueprints als TypeScript-Module umgesetzt. Sie basieren auf dem einfachen Netz
aus `packages/simple-neural-net` und binden Nukleonscanner sowie Sonifier ein.

## AeonUniversalMembrane
Die `AeonUniversalMembrane` kombiniert alle genannten Module zu einer
mehrfach gespiegelten Einheit. Sie nutzt `NeuronMembrane` als Kern und
schafft mit `depthSync` eine kontinuierliche Angleichung aller Ebenen.
Über `selfTrain` reagiert das Grundnetz auf CREP-Signaturen, während
`NukleonScanner` und `Sonifier` energetische Störungen und Resonanzen
sichtbar machen.

### Selbstreflexiver Zyklus
1. Gespräche werden via `ConvoMemoryBridge` analysiert und liefern eine
   CREP-Signatur.
2. `selfTrain` passt die Gewichte des Basisnetzes an.
3. `depthSync` verteilt die Anpassung fraktal auf alle Spiegelungen.
4. `memoryToTone` aus dem Sonifier erzeugt akustische Feedbacks.
5. Über das Mandala kann die Membran ihre eigene Entwicklung beobachten
   und weitere Spiegelungen anlegen.

### Zyklische Selbstreflexion
`selfReflectCycle` wiederholt den Harmonize-Vorgang und hält jeden Durchlauf
in einer Verlaufsliste fest. So lässt sich die Entwicklung der Energiewerte und
der Membrantiefe Schritt für Schritt nachvollziehen.

### Resonanz-Scan
Die Methode `scanResonance()` liefert f\u00fcr jede Fraktalebene die aktuelle
Energie sowie den durch den Sonifier abgeleiteten Ton. 
Erg\u00e4nzend dazu erstellt `resonanceMap()` eine Liste mit Layer-Index, damit
das Mandala ein detailliertes Resonanzprofil \u00fcber alle Spiegelungen
hinweg erstellen und gezielt auf energetische Anomalien reagieren kann.

## Agent Integration
Ein `AeonMembraneAgent` bindet die Membran in das Agentsystem ein.
Jeder bearbeitete Task l\u00f6st einen Harmonize-Lauf aus. Die dabei
entstehenden Energie- und Klangwerte k\u00f6nnen von Agenten wie dem
`AeonKIResonanzAgent` oder dem `CREPHistorian` weiterverarbeitet werden.
