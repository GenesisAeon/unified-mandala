import { expect, test } from 'vitest';
import { AIPeerConnector } from './AIPeerConnector';

test('registers peer and invokes route', async () => {
  const connector = new AIPeerConnector();
  let calledWith: any;
  const fetchMock = async (...args: any[]) => {
    calledWith = args;
    return { ok: true } as any;
  };
  (global as any).fetch = fetchMock;

  connector.register({ id: 'peer1', baseUrl: 'https://example.com/' });
  const res = await connector.invoke('peer1', '/ping');

  expect(calledWith).toEqual(['https://example.com/ping', undefined]);
  expect(res.ok).toBe(true);
});

test('lists and unregisters peers', () => {
  const connector = new AIPeerConnector();
  connector.register({ id: 'peer1', baseUrl: 'https://example.com/' });
  connector.register({ id: 'peer2', baseUrl: 'https://example.org/' });

  expect(connector.list()).toEqual([
    { id: 'peer1', baseUrl: 'https://example.com/' },
    { id: 'peer2', baseUrl: 'https://example.org/' }
  ]);

  expect(connector.unregister('peer1')).toBe(true);
  expect(connector.list()).toEqual([
    { id: 'peer2', baseUrl: 'https://example.org/' }
  ]);
});
