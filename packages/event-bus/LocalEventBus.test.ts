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
});

