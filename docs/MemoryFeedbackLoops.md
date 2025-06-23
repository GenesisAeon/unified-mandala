# Memory Feedback Loops & Periodic Thematic Scans

Dieses Dokument skizziert das Konzept eines selbstverwalteten Mandala-Gedächtnisses. Ein MemoryManager koordiniert drei Zeitskalen (daily, weekly, longterm) und nutzt Feedback Agents sowie einen Scheduler, um Gespräche zu fragmentieren, Code zu extrahieren und poetische Reports zu erzeugen.

## Blueprint
- **MemoryManager** verwaltet Short-/Mid-/Long-Term Speicherordner
- **Feedback Agents** (PoeticAgent, ScienceAgent, SelfAnalyzer)
- **node-cron Scheduler** liest `memory-jobs.yaml`
- Startcode legt Berichte in den jeweiligen Ordnern ab

Diese Beschreibung basiert auf den Gesprächsfragmenten im Ordner `GenesisAeonZIPMEM` und dient als Ausgangspunkt für weitere Implementierungen.
