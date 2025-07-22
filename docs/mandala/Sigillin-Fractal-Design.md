# Sigillin Mandala Fractal Design

Dieses Dokument fasst die Ideen aus "Sigillin Mandala Fraktal" zusammen.

- Sigillin werden in verschachtelten Ebenen gespeichert und können rekursiv erzeugt werden.
- Jede Ebene enthält Meta-Informationen (CREP-Wert, Ursprungssigil, Update-Zeit).
- Ein Parser generiert aus ZIP-Memory-Dateien neue Fraktal-Sigel.
- Die Struktur ermöglicht MetaCommits: Jeder Commit enthält Verweise auf vorherige Ebenen.
- Ziel ist ein leichtgewichtiges, aber erweiterbares Format für kollektive Sigillin.
