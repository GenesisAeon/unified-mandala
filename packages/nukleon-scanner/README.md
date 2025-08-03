# Nukleon Scanner

Extracts basic conversation memories with a pseudo CREP signature and can
bridge to the CREP engine for phi-based analysis.

## Key modules
- `ConvoMemoryBridge.ts` – simple parser returning text and signature values.
- `CREPBridge.ts` – connects conversation memories with the CREP engine's
  `NucleonScanner`.

## Basic usage
```ts
import { extractConvoMemory, analyzeConvoCREP } from '@unified-mandala/nukleon-scanner';
const mem = extractConvoMemory('hello world');
const analysis = analyzeConvoCREP('phi: 1.0\nphi: 0.5');
```

## Tests
[`ConvoMemoryBridge.test.ts`](./ConvoMemoryBridge.test.ts) and
[`CREPBridge.test.ts`](./CREPBridge.test.ts) demonstrate usage.
