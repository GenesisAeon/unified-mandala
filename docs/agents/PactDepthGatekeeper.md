# PactDepthGatekeeper

## Responsibilities
- Regelt Zugriffe abhängig von der ermittelten Tiefe.
- Nutzt `pact-depth-rules.ts` sowie `activatedSigillin.json`.

## Parameters
- `minLnSum` – erforderliche Mindesttiefe (Standard: 16).
- `role` – Rolle des anfragenden Nutzers.

## Example usage
```bash
node pact-depth-gatekeeper.ts --depth 17 --role admin
```
