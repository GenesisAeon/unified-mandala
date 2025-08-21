import { LocalEventBus } from './LocalEventBus';
import { NatsEventBus } from './NatsEventBus';
import { Subjects } from './subjects';
import type { Subscription } from 'nats';

/**
 * Bridge events between a LocalEventBus and a NatsEventBus.
 * For each subject the bridge forwards local publishes to NATS and
 * NATS messages back into the local bus.
 *
 * Returns a function that removes all listeners and subscriptions.
 */
export function bridgeEventBuses(
  local: LocalEventBus,
  nats: NatsEventBus,
  subjects: Subjects[],
): () => void {
  const cleanups: Array<() => void | Promise<void>> = [];

  for (const subject of subjects) {
    // Forward local events to NATS
    const offLocal = local.subscribe(subject, (data) => {
      // Fire-and-forget publish; errors are logged but not re-thrown
      nats.publish(subject, data).catch((err) => {
        console.error(`Failed to publish ${subject} to NATS`, err);
      });
    });
    cleanups.push(offLocal);

    // Forward NATS events to local bus
    const sub: Subscription = nats.subscribe(subject, (data) => {
      local.publish(subject, data);
    });
    cleanups.push(() => sub.unsubscribe());
  }

  return () => {
    for (const fn of cleanups) {
      try {
        const result = fn();
        if (result instanceof Promise) {
          // Prevent unhandled rejection warnings
          result.catch(() => undefined);
        }
      } catch {
        // ignore cleanup errors
      }
    }
  };
}
