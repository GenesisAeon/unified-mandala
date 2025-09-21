import { beforeEach, describe, expect, it, vi } from 'vitest';
import { connect, consumerOpts } from 'nats';

import { JetStreamBus } from '../../packages/event-bus/JetStreamBus';
import { Subjects } from '../../packages/event-bus/subjects';

const { mockPublish, mockSubscribe, mockClose, mockJetstream, mockConsumerOptsFactory } =
  vi.hoisted(() => {
    const publish = vi.fn();
    const subscribe = vi.fn(() => ({
      [Symbol.asyncIterator]: async function* () {
        // no-op async iterator to satisfy for-await loops in the implementation
      },
    }));
    const close = vi.fn();
    const jetstream = vi.fn(() => ({ publish, subscribe }));
    const consumerOptsFactory = vi.fn(() => ({
      durable: vi.fn(),
      manualAck: vi.fn(),
    }));
    return {
      mockPublish: publish,
      mockSubscribe: subscribe,
      mockClose: close,
      mockJetstream: jetstream,
      mockConsumerOptsFactory: consumerOptsFactory,
    };
  });

vi.mock('nats', async () => {
  const actual = await vi.importActual<typeof import('nats')>('nats');
  return {
    ...actual,
    connect: vi.fn(async () => ({ jetstream: mockJetstream, close: mockClose })),
    StringCodec: vi.fn(() => ({
      encode: (value: string) => Buffer.from(value),
      decode: (input: Uint8Array) => Buffer.from(input).toString(),
    })),
    consumerOpts: mockConsumerOptsFactory,
  };
});

const mockConnect = connect as unknown as vi.Mock;
const mockConsumerOpts = consumerOpts as unknown as vi.Mock;

describe('JetStreamBus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('connects with default url', async () => {
    const bus = new JetStreamBus();
    await bus.connect();
    expect(mockConnect).toHaveBeenCalledWith({ servers: 'nats://localhost:4222' });
  });

  it('throws when publishing without connection', async () => {
    const bus = new JetStreamBus();
    await expect(bus.publish(Subjects.CREP_UPDATE, { a: 1 })).rejects.toThrow('Not connected');
  });

  it('subscribes using durable consumer', async () => {
    const bus = new JetStreamBus({ durable: 'TEST' });
    await bus.connect();
    await bus.subscribe(Subjects.CREP_UPDATE, () => {});

    expect(mockConsumerOpts).toHaveBeenCalled();
    const optsInstance = mockConsumerOpts.mock.results.at(-1)?.value;
    expect(optsInstance?.durable).toHaveBeenCalledWith('TEST');
    expect(optsInstance?.manualAck).toHaveBeenCalled();
    expect(mockSubscribe).toHaveBeenCalled();
  });
});
