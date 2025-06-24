# Event Bus

The `NatsEventBus` provides a lightweight wrapper over the NATS client for communication between UnifiedMandala services.

## Key modules
- `NatsEventBus.ts` – connect, publish, subscribe and close helpers.
- `subjects.ts` – enumerates all well known subjects.

## Available subjects
- `CREP_UPDATE` – broadcast when CREP metrics change
- `AGENT_HEARTBEAT` – periodic heartbeat of active agents

## Example integration
```ts
import { NatsEventBus, Subjects } from '@unified-mandala/event-bus';

const bus = new NatsEventBus();
await bus.connect('nats://localhost:4222');

bus.subscribe(Subjects.AGENT_HEARTBEAT, data => {
  console.log('Heartbeat', data);
});

await bus.publish(Subjects.CREP_UPDATE, { score: 0.9 });
```

## Tests
See [`NatsEventBus.test.ts`](./NatsEventBus.test.ts).
