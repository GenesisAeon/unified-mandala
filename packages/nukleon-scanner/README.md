# Nukleon Scanner

Extracts basic conversation memories with a pseudo CREP signature.

## Key module
- `ConvoMemoryBridge.ts` – simple parser returning text and signature values.

## Basic usage
```ts
import { extractConvoMemory } from '@unified-mandala/nukleon-scanner';
const mem = extractConvoMemory('hello world');
```

## Tests
[`ConvoMemoryBridge.test.ts`](./ConvoMemoryBridge.test.ts) demonstrates usage.
