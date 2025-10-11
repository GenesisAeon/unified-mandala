# Sharedream Interface

Data bridge used by the demo UI to expose Sigillin nodes and CREP state.

## Key module

- `sync.ts` – collects Sigillin info and current CREP states.

## Basic usage

```ts
import { syncSharedream } from '@unified-mandala/sharedream-interface';
const data = syncSharedream();
```
