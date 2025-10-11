import { WebhookSystem } from './WebhookSystem';

beforeEach(() => {
  // @ts-ignore
  global.fetch = jest.fn().mockResolvedValue({ ok: true });
});

test('emits events and posts to webhooks', async () => {
  const w = new WebhookSystem();
  const res: any[] = [];
  w.on('a', (p) => res.push(p));
  w.register('a', 'http://example.com/hook');
  await w.trigger('a', { id: 1 });

  expect(res).toEqual([{ id: 1 }]);
  expect(fetch).toHaveBeenCalledWith(
    'http://example.com/hook',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1 }),
    }),
  );
});
