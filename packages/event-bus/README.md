# Event Bus

Thin wrapper around NATS messaging for the Mandala ecosystem.

## Key modules
- `NatsEventBus.ts` – connect, publish and subscribe helpers.
- `subjects.ts` – enumerates well known event subjects.

## Basic usage
```ts
import { NatsEventBus, Subjects } from '@unified-mandala/event-bus';
const bus = new NatsEventBus();
await bus.connect();
await bus.publish(Subjects.CREP_UPDATE, { value: 1 });
```

## Tests
See [`NatsEventBus.test.ts`](./NatsEventBus.test.ts).
