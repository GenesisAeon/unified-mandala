import { LocalEventBus } from './LocalEventBus';
import { Subjects } from './subjects';

describe('LocalEventBus', () => {
  it('publishes and subscribes to events', () => {
    const bus = new LocalEventBus();
    const handler = jest.fn();
    const unsubscribe = bus.subscribe(Subjects.CREP_UPDATE, handler);
    const payload = { value: 42 };

    bus.publish(Subjects.CREP_UPDATE, payload);
    expect(handler).toHaveBeenCalledWith(payload);

    // ensure unsubscribe stops receiving events
    unsubscribe();
    bus.publish(Subjects.CREP_UPDATE, { value: 7 });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('handles agent health and error events', () => {
    const bus = new LocalEventBus();
    const healthHandler = jest.fn();
    const errorHandler = jest.fn();

    bus.subscribe(Subjects.AGENT_HEALTH, healthHandler);
    bus.subscribe(Subjects.AGENT_ERROR, errorHandler);

    const healthPayload = { ok: true };
    const errorPayload = { message: 'boom' };

    bus.publish(Subjects.AGENT_HEALTH, healthPayload);
    bus.publish(Subjects.AGENT_ERROR, errorPayload);

    expect(healthHandler).toHaveBeenCalledWith(healthPayload);
    expect(errorHandler).toHaveBeenCalledWith(errorPayload);
  });
});

