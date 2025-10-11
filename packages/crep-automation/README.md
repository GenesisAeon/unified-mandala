# CREP Automation

Utilities to automate CREP driven feedback and rituals.

## Key modules

- `CREPFeedbackLoop.ts` – derive follow-up tasks from CREP snapshots.
- `SymbolzeitSync.ts` – connect CREP engines with the symbol time manager.
- `AestheticsLayer.ts` and `EthicsLayer.ts` – UI theme and filter helpers.
- `RitualCompiler.ts` – compile rituals into finite state machines.

## Basic usage

```ts
import { generateFeedbackTasks } from '@unified-mandala/crep-automation';
const tasks = generateFeedbackTasks({ R: -1, E: 0 });
```

## Tests

See the many `*.test.ts` files for individual modules.
