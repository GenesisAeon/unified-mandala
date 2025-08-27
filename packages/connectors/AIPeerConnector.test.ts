import { expect, test, vi } from 'vitest';
import { AIPeerConnector } from './AIPeerConnector';

test('registers peer and invokes route', async () => {
  const connector = new AIPeerConnector();
  const fetchMock = vi.fn(async () => ({ ok: true }));
  (global as any).fetch = fetchMock;

  connector.register({ id: 'peer1', baseUrl: 'https://example.com/' });
  const res = await connector.invoke('peer1', '/ping');

  expect(fetchMock).toHaveBeenCalledWith('https://example.com/ping', undefined);
  expect(res.ok).toBe(true);
});
