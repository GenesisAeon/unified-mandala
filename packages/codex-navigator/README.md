# Codex Navigator

Generates short poems from tasks and compiles them into YAML chronics.

## Key module
- `resonanzPoetik.ts` – provides `generateHaiku()` and `compileYAML()` utilities.

## Basic usage
```ts
import { ResonanzPoetik } from '@unified-mandala/codex-navigator';
const text = ResonanzPoetik.generateHaiku(task, 'Alpha', 0.7);
```

## Tests
See [`resonanzPoetik.test.ts`](./resonanzPoetik.test.ts) for examples.
