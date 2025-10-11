# Emergenz-Scan (Archivist)

Ziel: Finde minimale, hochwirksame Patches entlang CREP (Coherence/Resonance/Emergence/Poetics).
Schritte:

1. Lese: out/sigillin_index.json, out/sigils_errors.json, docs/, src/adapters/**, scripts/**
2. Liefere:
   - 5–10 „atomic patches“ (je ≤ 15 Zeilen) mit Pfad + Unified-Diff
   - Priorisierung (High/Med/Low) mit CREP-Begründung
   - Risiken + Testanweisungen (pnpm/pytest)
     Output-Format: fenced ```patch blocks, dann test commands as code.
