# Core

Shared infrastructure pieces for memory management and helpers.

## Key modules

- `AeonMemory.ts` – persist and query chronicle entries.
- `TriggerArchive.ts` – record triggered events.
- `AdaptiveThreshold.ts` and `DebounceManager.ts` – control CREP triggers.
- `withCircuit.ts` – small circuit breaker wrapper.

## Basic usage

```ts
import { AeonMemory } from '@unified-mandala/core';
AeonMemory.record('Task started');
```

## Tests

Multiple Jest suites, e.g. [`AeonMemory.test.ts`](./AeonMemory.test.ts).
