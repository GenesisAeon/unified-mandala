# GenesisAeonNavigator

## Responsibilities

- Steuert Phasen im Genesis-Aeon und loggt Übergänge.
- Meldet unbekannte Phasen, wenn keine Phase-Map vorliegt.

## Parameters

- `phaseMap` – YAML-Datei mit definierten Phasen.
- `startPhase` – Name der initialen Phase.

## Example usage

```bash
node genesis-aeon-navigator.ts --map ./phase-map.yaml
```
