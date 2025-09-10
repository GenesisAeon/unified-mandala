# Sigil Schema

## CREP Field

Sigil-Dateien können CREP-Werte in verschiedenen Formaten enthalten:

- direkt als Zahl oder String (`0..1`)
- als Objekt mit Kleinbuchstaben: `coherence`, `resonance`, `emergence`, `poetics`
- als Objekt mit Großbuchstaben: `C`, `R`, `E`, `P`
- als verschachteltes Feld `crep` bzw. `CREP`
- als einzelne Felder `score`, `C`, `R`, `E`, `P` auf Root-Ebene

Der Indexer nutzt `normalizeCREP` und erzeugt daraus die Normalform:

```json
{
  "score": 0.8,
  "parts": { "c": 0.8, "r": 0.7, "e": 0.9, "p": 0.8 },
  "source": "lowercase"
}
```

Vorhandene Werte werden erhalten und nicht überschrieben.
