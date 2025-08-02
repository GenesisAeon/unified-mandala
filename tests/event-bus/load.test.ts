/* @jest-environment node */
import { NatsEventBus } from '../../packages/event-bus/NatsEventBus';
import { Subjects } from '../../packages/event-bus/subjects';
import { connect } from 'nats';

jest.mock('nats', () => {
  const publish = jest.fn();
  const subscribe = jest.fn(() => ({
    [Symbol.asyncIterator]: async function* () {}
  }));
  const close = jest.fn();
  const sc = {
    encode: (v: string) => Buffer.from(v),
    decode: (b: Uint8Array) => Buffer.from(b).toString()
  };
  return {
    connect: jest.fn(() => Promise.resolve({ publish, subscribe, close })),
    StringCodec: jest.fn(() => sc)
  };
});

const mockConnect = connect as jest.Mock;

describe('Event bus load test', () => {
  it('handles 1000 concurrent publishes', async () => {
    const bus = new NatsEventBus();
    await bus.connect();
    const start = Date.now();
    const tasks = Array.from({ length: 1000 }, (_, i) =>
      bus.publish(Subjects.CREP_UPDATE, { seq: i })
    );
    await Promise.all(tasks);
    const duration = Date.now() - start;
    const { publish } = await mockConnect.mock.results[0].value;
    expect(publish).toHaveBeenCalledTimes(1000);
    expect(duration).toBeLessThan(1000);
    await bus.close();
  });
});
