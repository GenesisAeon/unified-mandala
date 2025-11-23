import { EventEmitter } from 'node:events';
import tls from 'node:tls';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tlsPreflight } from '../security/tlsPreflight.js';

class FakeSocket extends EventEmitter {
  public authorized = true;
  public remoteAddress: string | undefined;
  private timeoutHandler: (() => void) | null = null;

  end(): this {
    this.emit('end');
    return this;
  }

  destroy(error?: Error): this {
    if (error) {
      this.emit('error', error);
    }
    this.emit('close');
    return this;
  }

  setTimeout(_ms: number, handler: () => void): this {
    this.timeoutHandler = handler;
    return this;
  }

  triggerTimeout(): void {
    this.timeoutHandler?.();
  }
}

describe('tlsPreflight', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves with remote address and SAN status', async () => {
    const socket = new FakeSocket();
    socket.remoteAddress = '203.0.113.10';
    socket.authorized = true;

    const connectMock = vi.spyOn(tls, 'connect').mockReturnValue(socket as unknown as tls.TLSSocket);

    const preflight = tlsPreflight('example.com', '203.0.113.10', 443, 1000);
    socket.emit('secureConnect');

    await expect(preflight).resolves.toEqual({ remoteAddress: '203.0.113.10', sanOk: true });
    expect(connectMock).toHaveBeenCalledWith(
      expect.objectContaining({ host: '203.0.113.10', port: 443, servername: 'example.com' }),
    );
  });

  it('rejects on socket error', async () => {
    const socket = new FakeSocket();
    const connectMock = vi.spyOn(tls, 'connect').mockReturnValue(socket as unknown as tls.TLSSocket);

    const preflight = tlsPreflight('example.org', '198.51.100.7', 443, 1000);
    const err = new Error('boom');
    socket.emit('error', err);

    await expect(preflight).rejects.toBe(err);
    expect(connectMock).toHaveBeenCalled();
  });

  it('rejects on timeout', async () => {
    const socket = new FakeSocket();
    vi.spyOn(tls, 'connect').mockReturnValue(socket as unknown as tls.TLSSocket);

    const preflight = tlsPreflight('timeout.test', '192.0.2.9', 443, 50);
    socket.triggerTimeout();

    await expect(preflight).rejects.toThrow('TLS_PREFLIGHT_TIMEOUT');
  });

  it('normalizes IPv6 remote addresses', async () => {
    const socket = new FakeSocket();
    socket.remoteAddress = '2001:0db8:0000:0000:0000:0000:0000:0001';
    socket.authorized = true;

    vi.spyOn(tls, 'connect').mockReturnValue(socket as unknown as tls.TLSSocket);

    const resultPromise = tlsPreflight('example.net', '2001:db8::1', 443, 1000);
    socket.emit('secureConnect');

    await expect(resultPromise).resolves.toEqual({ remoteAddress: '2001:db8:0:0:0:0:0:1', sanOk: true });
  });
});
