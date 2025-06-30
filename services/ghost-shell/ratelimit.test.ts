import { rateLimit } from './ratelimit';

const socketFactory = (addr: string) => ({ handshake: { address: addr } }) as any;

describe('rate limit', () => {
  it('allows under limit', async () => {
    const socket = socketFactory('1');
    let called = false;
    await rateLimit(socket, () => { called = true; });
    expect(called).toBe(true);
  });

  it('blocks over limit', async () => {
    const socket = socketFactory('2');
    for (let i = 0; i < 10; i++) {
      await rateLimit(socket, () => {});
    }
    let err: Error | null = null;
    await rateLimit(socket, (e?: Error) => { err = e || null; });
    expect(err).toBeInstanceOf(Error);
  });
});
