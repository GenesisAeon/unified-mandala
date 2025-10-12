import { describe, it, expect, vi, beforeEach } from 'vitest';

// Hoist mocks so Vitest can safely mock before module evaluation
const { requestMock, connectMock } = vi.hoisted(() => {
  const requestMock = vi.fn(async (_subject: string, data: Uint8Array) => {
    const buf = Buffer.from(data as any);
    const incoming = JSON.parse(buf.toString('utf8'));
    const response = { ok: true, result: { echoed: incoming } };
    return { data: Buffer.from(JSON.stringify(response), 'utf8') } as any;
  });
  const connectMock = vi.fn(async () => ({ request: requestMock }));
  return { requestMock, connectMock };
});

vi.mock(
  'nats',
  () =>
    ({
      connect: connectMock,
      StringCodec: () => ({
        encode: (s: string) => Buffer.from(s, 'utf8'),
        decode: (u: Uint8Array) => Buffer.from(u as any).toString('utf8'),
      }),
    }) as any,
);

// Defer importing natsClient until after mocks are in place inside each test

// Provide a stable way to access mocks from the hoisted scope
const mocks = vi.hoisted(() => {
  const state: any = {};
  state.requestMock = vi.fn(async (_subject: string, data: Uint8Array) => {
    const buf = Buffer.from(data as any);
    const incoming = JSON.parse(buf.toString('utf8'));
    const response = { ok: true, result: { echoed: incoming } };
    return { data: Buffer.from(JSON.stringify(response), 'utf8') } as any;
  });
  state.connectMock = vi.fn(async () => ({ request: state.requestMock }));
  return { getState: () => state };
});

vi.mock('nats', () => {
  const state = mocks.getState() as any;
  return {
    connect: state.connectMock,
    StringCodec: () => ({
      encode: (s: string) => Buffer.from(s, 'utf8'),
      decode: (u: Uint8Array) => Buffer.from(u as any).toString('utf8'),
    }),
  } as any;
});

// Also inject into global for modules that check __UM_TEST_NATS
const __s = mocks.getState() as any;
(globalThis as any).__UM_TEST_NATS = {
  connect: __s.connectMock,
  StringCodec: () => ({
    encode: (s: string) => Buffer.from(s, 'utf8'),
    decode: (u: Uint8Array) => Buffer.from(u as any).toString('utf8'),
  }),
};

describe('natsClient.requestAI', () => {
  beforeEach(() => {
    const s: any = mocks.getState();
    s.requestMock.mockClear();
    s.connectMock.mockClear();
  });

  it('sends request and returns result', async () => {
    const { requestAI } = await import('../../apps/api/src/natsClient');
    const payload = { messages: [{ role: 'user', content: 'hi' }] } as any;
    const result = await requestAI(payload, { subject: 'ai.request', timeout: 5000 } as any);
    expect(result).toEqual({ echoed: payload });
    const s: any = mocks.getState();
    expect(s.requestMock).toHaveBeenCalledTimes(1);
  });

  it('throws when backend returns not ok', async () => {
    const s: any = mocks.getState();
    s.requestMock.mockImplementationOnce(async () => {
      const bad = { ok: false, error: 'nope' };
      return { data: Buffer.from(JSON.stringify(bad), 'utf8') } as any;
    });
    const { requestAI } = await import('../../apps/api/src/natsClient');
    await expect(requestAI({ foo: 1 } as any)).rejects.toThrow(/nope/);
  });

  it('reuses single NATS connection across calls', async () => {
    // Reset module state so the cached `connection` is recreated for this test
    vi.resetModules();
    const s: any = mocks.getState();
    s.connectMock.mockClear();
    s.requestMock.mockClear();
    const mod = await import('../../apps/api/src/natsClient');
    await mod.requestAI({ a: 1 } as any);
    await mod.requestAI({ a: 2 } as any);
    expect(s.connectMock).toHaveBeenCalledTimes(1);
    expect(s.requestMock).toHaveBeenCalledTimes(2);
  });
});
