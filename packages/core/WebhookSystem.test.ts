import { WebhookSystem } from './WebhookSystem';

test('emits events', () => {
  const w = new WebhookSystem();
  const res: any[] = [];
  w.on('a', p => res.push(p));
  w.trigger('a', 1);
  expect(res).toEqual([1]);
});
