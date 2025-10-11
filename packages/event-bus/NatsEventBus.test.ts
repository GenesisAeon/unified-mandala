import { NatsEventBus } from './NatsEventBus';
import { Subjects } from './subjects';
import { connect } from 'nats';

jest.mock('nats', () => {
  const publish = jest.fn();
  const subscribe = jest.fn(() => ({
    [Symbol.asyncIterator]: async function* () {},
  }));
  const close = jest.fn();
  const sc = {
    encode: (v: string) => Buffer.from(v),
    decode: (b: Uint8Array) => Buffer.from(b).toString(),
  };
  return {
    connect: jest.fn(() => Promise.resolve({ publish, subscribe, close })),
    StringCodec: jest.fn(() => sc),
  };
});

const mockConnect = connect as jest.Mock;

describe('NatsEventBus', () => {
  beforeEach(() => {
    mockConnect.mockClear();
  });

  it('connects with default url', async () => {
    const bus = new NatsEventBus();
    await bus.connect();
    expect(mockConnect).toHaveBeenCalledWith({ servers: 'nats://localhost:4222' });
  });

  it('connects with auth options', async () => {
    const bus = new NatsEventBus();
    await bus.connect({ url: 'nats://demo:4222', creds: 'auth.creds', maxReconnects: 5 });
    expect(mockConnect).toHaveBeenCalledWith({
      servers: 'nats://demo:4222',
      userCreds: 'auth.creds',
      maxReconnectAttempts: 5,
    });
  });

  it('throws when publishing without connection', async () => {
    const bus = new NatsEventBus();
    await expect(bus.publish(Subjects.CREP_UPDATE, { a: 1 })).rejects.toThrow('Not connected');
  });
});
