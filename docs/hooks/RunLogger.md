# RunLogger

The `RunLogger` utility writes simulation or workflow events to a JSON Lines file.
Each run receives a unique `run_id`, allowing multiple runs to share the same log file.

## Usage

```ts
import { RunLogger } from '../../packages/shared-utils/runLogger';

const logger = new RunLogger('runlog.jsonl');
logger.log('start');
logger.log('metric', { loss: 0.123 });

// read back entries
const entries = RunLogger.read('runlog.jsonl');
```

## JSONL helper

The logger uses `jsonlLogger` under the hood, which exposes `appendJsonl` and `readJsonl`
functions for generic JSONL work.
