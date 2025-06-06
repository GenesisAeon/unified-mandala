# Shared Utils

Gemeinsame Hilfsfunktionen für UnifiedMandala.

## Funktionen
- **splitText** und **splitFile** – zerlegen Texte in handliche Fragmente
- **splitJsonArrayFile** und **writeJsonChunks** – teilen große JSON-Arrays auf
- **grepJsonArrayFile** – filtert JSON-Arrays per Regex und schreibt Treffer
- **getCREPPhaseColor** – ordnet CREP-Werten Farbstufen zu
- **analyzeRepo** – liefert Paket- und Dokument-Statistiken
- **extractTodosFromFile** – liest Aufgabenlisten aus Dateien
- **updateTodoSigilStatus** – markiert erledigte Aufgaben im todo-sigil.yaml
- **createTodoSigil** und **generateTodoSigilFromFile** – erzeugen ToDo-Sigilline
- **extractCodeSnippetsFromFile** – durchsucht Conversation-JSON nach Code und legt Snippets ab
- **scanTodoComments** – findet TODO-Kommentare in Quelltexten
