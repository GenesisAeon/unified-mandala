import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock askOpenAI to avoid network
vi.mock('../src/index.js', () => ({
  askOpenAI: vi.fn(async (_p: any) => ({ text: 'ok', model: 'mock' })),
}));

// Mock NATS connect + subscription iterator
const respondMock = vi.fn();
const subscribeMock = vi.fn(() => ({
  [Symbol.asyncIterator]: async function* () {
    yield { data: Buffer.from(JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] })) , respond: respondMock } as any;
  },
}));

vi.mock('nats', () => ({
  connect: vi.fn(async () => ({ subscribe: subscribeMock })),
  StringCodec: () => ({
    encode: (s: string) => Buffer.from(s, 'utf8'),
    decode: (u: Uint8Array) => Buffer.from(u as any).toString('utf8'),
  }),
}));

// Also inject for modules that read __UM_TEST_NATS
(globalThis as any).__UM_TEST_NATS = {
  connect: async () => ({ subscribe: subscribeMock }),
  StringCodec: () => ({
    encode: (s: string) => Buffer.from(s, 'utf8'),
    decode: (u: Uint8Array) => Buffer.from(u as any).toString('utf8'),
  }),
};

describe('nats-worker main loop (single message)', () => {
  beforeEach(() => {
    respondMock.mockClear();
    subscribeMock.mockClear();
  });

  it('subscribes and responds with ok', async () => {
    // Import triggers main()
    await import('../src/nats-worker');
    // Give the event loop a tick to process async iterator
    await new Promise((r) => setTimeout(r, 0));
    expect(subscribeMock).toHaveBeenCalledTimes(1);
    expect(respondMock).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(Buffer.from(respondMock.mock.calls[0][0]).toString('utf8'));
    expect(payload.ok).toBe(true);
    expect(payload.result.text).toBe('ok');
  });
});

