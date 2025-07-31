# Offline Testing & ToDo Sync

Dieses Dokument beschreibt, wie man das Repository ohne Internetzugang testen kann.

1. **Docker Compose**: Nutze `docker-compose up`, um Abhängigkeiten lokal zu starten.
2. **Node Troubleshooting**: Bei Fehlern in Abhängigkeiten hilft `pnpm install --offline`.
3. **ToDo-Synchronisierung**: Führe `node scripts/sync-todo-progress.js` aus, um `advancedToDo.json` und `advancedprogress.json` abzugleichen.

Damit lassen sich Tests lokal ausführen und der Fortschritt bleibt konsistent.
