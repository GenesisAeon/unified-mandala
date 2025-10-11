# Nukleon Sonifier

Simple mapping from memory weight to symbolic tone names.

## Key module

- `MemorySonifier.ts` – contains `memoryToTone()` helper.

## Basic usage

```ts
import { memoryToTone } from '@unified-mandala/nukleon-sonifier';
const tone = memoryToTone(0.5);
```

## Tests

See [`MemorySonifier.test.ts`](./MemorySonifier.test.ts).
