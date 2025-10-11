# PactDepthGatekeeper

## Responsibilities

- Regelt Zugriffe abhängig von der ermittelten Tiefe.
- Nutzt `pact-depth-rules.ts` sowie `activatedSigillin.json`.
- Verarbeitet Rollen und erlaubt nur autorisierte Zugriffe.

## Parameters

- `minLnSum` – erforderliche Mindesttiefe (Standard: 16).
- `role` – Rolle des anfragenden Nutzers.

## Role Access

Nur Nutzer mit der Rolle `admin` erhalten Zugriff. `developer` und `guest` werden auch bei ausreichender Tiefe abgewiesen.

## Example usage

```bash
node pact-depth-gatekeeper.ts --depth 17 --role admin
```
