# CLI Tools

Sammlung von Befehlen zur Arbeit mit Sigillin- und CREP-Daten.

- **sigillin-cli.js** – Validierung, Initialisierung und Graph-Export
- **sigillin-cli.js bump** – erh\xF6ht die Version eines Sigillins
- **export-doc.js** – Exportiert CREP-Historie als Markdown
- **sigillin-archive.js** – Erstellt poetisches Archiv aller Sigillin-Dateien
- **sigillin-cli.js todo-sigil** – erzeugt `docs/sigils/todo-sigil.yaml` aus Aufgabenlisten
- **sigillin-cli.js list-open-tasks** – listet offene Tasks aus `advancedToDo.yaml`

- **SigillinValidator.ts** – Prüft eine Sigillin-Datei gegen das Schema

### SigillinOnDemandGenerator

Einfache Utility, um spontan Sigillin-Dateien zu erzeugen:

```bash
node SigillinOnDemandGenerator.js "Meine Phrase" > my-sigil.json
```

### Backup Utilities

Der `BackupManager` (in `packages/shared-utils`) kann Dateien in ein `.backup`-Verzeichnis kopieren. Beispiel:

```ts
import { BackupManager } from 'shared-utils/BackupManager';
const bm = new BackupManager();
bm.backupFile('important.yaml');
```

Diese Funktionen eignen sich, um Sigillin oder Konfigurationsdateien regelm\xE4\xDFig zu sichern.
