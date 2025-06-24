# MetaCommit Planung
Diese Datei beschreibt MetaCommits, also Arbeitsaufträge, die zu umfangreich für einen einzelnen Commit sind.
Alle offenen MetaCommits werden in `metacommit.yaml` und `metacommit.json` referenziert.
Dev-Agents prüfen zu Beginn eines Laufs auf diese Dateien und priorisieren deren Aufgaben, bis sie erledigt und die Dateien gelöscht wurden.
