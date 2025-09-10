# Sigillin-Index und Formate

Der Sigillin-Indexer (`pnpm sigils:index`) sammelt Metadaten aus Dateien im Ordner `docs/sigils`.
Der zugrunde liegende Parser `safeSigilParse` akzeptiert folgende Formate:

- **YAML** (`.yaml`, `.yml`)
- **JSON** (`.json`)
- **Markdown** mit YAML-Frontmatter (`.md`)
- **JSON Lines** (`.jsonl`)

CREP-Werte können auf zwei Arten abgelegt werden:

- als numerischer `score`
- als Objekt `crep` mit den Feldern `c`, `r`, `e`, `p`

Geschachtelte CREP-Werte innerhalb von Arrays oder Objekten werden ebenfalls erkannt.

Beim Indexlauf entstehen:

- `out/sigillin_index.json` – gesammelte Einträge
- `out/sigils_errors.json` – Parserfehler mit Dateiangaben

Im CI sollte `pnpm sigils:index:strict` verwendet werden, damit der Build bei fehlerhaften Sigillin-Dateien scheitert.
