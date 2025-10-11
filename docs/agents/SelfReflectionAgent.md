# SelfReflectionAgent

## Responsibilities

- Capture introspection messages for later review.
- Summarize logs into a single string.
- Optionally analyse stored memories using `MemoryGovernance`.
- Support timestamped entries.

## Example usage

```ts
import { SelfReflectionAgent } from '../packages/agents/SelfReflectionAgent';
import { MemoryGovernance } from '../packages/core/MemoryGovernance';

const gov = new MemoryGovernance();
const agent = new SelfReflectionAgent(gov);

gov.set('intro', 'first boot');
agent.record('system started');
agent.recordWithTimestamp('event A');

const flagged = agent.reflectMemory(/boot/);
console.log(flagged); // ['intro']
console.log(agent.summarize());
```

## Integration tips

- Instantiate once per context or module to gather insights.
- Pass a `MemoryGovernance` instance if you need to check memories.
- Use `reflectMemory` to detect problematic patterns in stored data.
