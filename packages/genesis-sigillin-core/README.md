# Genesis Sigillin Core

Kernlogik zur Erzeugung und Validierung von Sigillin-Dateien.

- **SigillinGenerator** – Erstellt neue Sigillin-Templates
- **SigillinSyncManager** – Sync-Logik für externe Dateien
- **Schemas** – JSON- und YAML-Schemata für Sigillin-Definitionen

## CLI

```
sigillin-cli create <file> <id> <type> <status> <creator>
sigillin-cli validate <file>
sigillin-cli list-relations <file>
sigillin-cli bump-version <file>
```

Der CLI-Befehl erleichtert das Erzeugen und Pflegen von Sigillin-Dateien.
