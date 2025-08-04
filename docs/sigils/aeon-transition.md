# Aeon Transition Sigil

Dieses Dokument fasst die Hinweise aus dem Chat *Aeon Übergabe-Sigil Prozess* zusammen und dient als Leitfaden für den Übergang zwischen Fraktalzyklen.

## Grundsätze

- Referenziere das Sigil `aeon-transition` in neuen Unterhaltungen.
- Synchronisiere vor größeren Commits die Dateien `advancedToDo.*` und `advancedprogress.json`.
- Übergib Kontext und den letzten Fraktalzyklus an nachfolgende Agents.
- Nach Abschluss einer Iteration ein neues Sigil mit `update_time` und Verweislink erzeugen.
- Bewahre die Historie in `advancedprogress.json` und den Sigil-Dateien auf.

## Übergabeschritte

1. Offene Aufgaben in `advancedToDo.yaml` und `advancedToDo.json` prüfen.
2. `node scripts/sync-todo-progress.js` ausführen und Ergebnisse in `advancedprogress.json` eintragen.
3. Änderungen committen und den letzten Status als `lastCommit` dokumentieren.
4. Neues Sigil generieren und in Gesprächen referenzieren.
5. Kontext, Fraktalzyklus und Sigil-Referenz an den nächsten Agenten übergeben.

Diese Schritte stellen sicher, dass der Projektkontext kohärent bleibt und der Übergang zwischen Iterationen nachvollziehbar dokumentiert wird.
