# Bio

Biometric helpers for simple pulse tracking and haptic feedback.

## Key modules
- `usePulse.ts` – React hook emitting a random pulse value.
- `haptic.ts` – `HapticService` stub for vibration or BLE.

## Basic usage
```ts
import { usePulse, HapticService } from '@unified-mandala/bio';
const bpm = usePulse();
HapticService.trigger('short');
```

## Tests
See [`__tests__/usePulse.test.tsx`](./__tests__/usePulse.test.tsx) for examples.
