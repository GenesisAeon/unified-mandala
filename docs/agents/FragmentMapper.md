# FragmentMapper

## Responsibilities
- Ordnet Gesprächsfragmente Themen und Symbolen zu.
- Erstellt daraus Aufgabenketten und speichert sie in `codexwork.yaml`.

## Parameters
- `inputPath` – Pfad zur Datei `fragmented_conversation.json`.
- `outputPath` – Ziel für das generierte `codexwork.yaml`.

## Example usage
```bash
node fragment-mapper.js ./fragmented_conversation.json
```
