# CodexAuditAgent

## Responsibilities
- Prüft Repository‑Module auf Emergenzpotenzial und Tiefe.
- Nutzt `audit-core.ts`, `depthvalue-core.ts` und `crepJudgeGPT`.
- Weist Sigillin aus `sigillin_bundle.sigil.json` zu.
- Schreibt Empfehlungen in `restructureSuggestions.yaml`.

## Parameters
- `depthThreshold` – Minimaler `lnSum`‑Wert für eine Prüfung (Standard: 15).
- `crepState` – Erwarteter CREP‑Zustand, typischerweise `emergence`.
- `sigillinBundlePath` – Pfad zur Sigillin‑Bundle‑Datei.

## Example usage
```bash
node mandala-sync.ts audit --depth 15 --crep emergence
```
Generiert eine Empfehlungsliste in `restructureSuggestions.yaml`.
