# EvolverGPT

## Responsibilities
- Generiert alternative Entwicklungspfade auf Basis des CREP-Status.
- Entscheidet mithilfe von `codex-evolver.ts` und `crepdecision-core.ts`.
- Schreibt poetische Commits in `poeticCommits.md`.
- Aktualisiert `resonantBranchMap.yaml`.

## Parameters
- `crepScoreThreshold` – Mindestscore zum Auslösen (≥ 0.6).
- `symbol` – Symbolisches Tiefen‑Signal, z. B. "🌪".
- `branchMap` – Pfad zu `resonantBranchMap.yaml`.

## Example usage
```bash
node codex-evolver.ts --score 0.7 --symbol "🌪"
```
