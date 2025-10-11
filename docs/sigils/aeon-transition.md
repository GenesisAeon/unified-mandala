# Aeon Transition Sigil

Dieses Dokument fasst die Hinweise aus dem Chat _Aeon Übergabe-Sigil Prozess_ zusammen.

- Referenziere das Sigil `aeon-transition` in neuen Unterhaltungen.
- Synchronisiere vor größeren Commits die Dateien `advancedToDo.*` und `advancedprogress.json`.
- Übergib Kontext und den letzten Fraktalzyklus an nachfolgende Agents.
- Nach Abschluss einer Iteration ein neues Sigil mit `update_time` und Verweislink erzeugen.
- Bewahre die Historie in `advancedprogress.json` und den Sigil-Dateien auf.
- Validiere Plugin-Manifeste gegen `plugins/manifest.schema.json` bevor neue Komponenten geladen werden.
- Nutze `npm run aeon:transition` um den Übergabeprozess zu automatisieren und das neue Sigil zu erzeugen.
- Prüfe mit `update:advanced-todo` offene Tasks und markiere erledigte Einträge, um Redundanzen zu vermeiden.
