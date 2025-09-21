import { JetStreamBus } from './JetStreamBus';
import { Subjects } from './subjects';
import { connect, consumerOpts } from 'nats';

const mockPublish = jest.fn();
const mockSubscribe = jest.fn(() => ({
  [Symbol.asyncIterator]: async function* () {},
}));
const mockClose = jest.fn();
const mockJetstream = jest.fn(() => ({ publish: mockPublish, subscribe: mockSubscribe }));
const mockGetAccountInfo = jest.fn(() => Promise.resolve({}));
const mockJetstreamManager = jest.fn(() =>
  Promise.resolve({
    getAccountInfo: mockGetAccountInfo,
  }),
);

jest.mock('nats', () => {
  const actual = jest.requireActual('nats');
  return {
    ...actual,
    connect: jest.fn(() =>
      Promise.resolve({
        jetstream: mockJetstream,
        jetstreamManager: mockJetstreamManager,
        close: mockClose,
      }),
    ),
    StringCodec: jest.fn(() => ({ encode: (v: string) => Buffer.from(v), decode: (b: Uint8Array) => Buffer.from(b).toString() })),
    consumerOpts: jest.fn(() => ({ durable: jest.fn(), manualAck: jest.fn() })),
  };
});

const mockConnect = connect as unknown as jest.Mock;
const mockConsumerOpts = consumerOpts as unknown as jest.Mock;

describe('JetStreamBus', () => {
  beforeEach(() => {
    mockConnect.mockClear();
    mockPublish.mockClear();
    mockSubscribe.mockClear();
    mockConsumerOpts.mockClear();
    mockJetstreamManager.mockClear();
    mockGetAccountInfo.mockClear();
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
    expect(mockSubscribe).toHaveBeenCalled();
  });
});
