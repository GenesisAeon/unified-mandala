# PatternReactivator

## Responsibilities
- Reaktiviert Aufgabenketten bei niedrigem CREP-Score.
- Gibt kein Ereignis aus, wenn kein passendes Muster gefunden wird.

## Parameters
- `scoreLimit` – CREP-Grenze, unter der reaktiviert wird.
- `patternStore` – Quelle der gespeicherten Muster.

## Example usage
```bash
node pattern-reactivator.ts --score 0.3
```
