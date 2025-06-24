# DepthBundleExporter

## Responsibilities
- Exportiert Tiefen-Daten als Sigillin-Bundle und Visualisierungen.
- Erstellt `sigillin_depth_bundle.sigil.json`, `depth_index.md` und Tiefen-SVGs.

## Parameters
- `bundlePath` – Zielpfad des Sigillin-Bundles.
- `eventTrigger` – Optionaler CREP-Event wie `bundleReady`.

## Example usage
```bash
node export-depth-bundle.ts --out ./exports
```
