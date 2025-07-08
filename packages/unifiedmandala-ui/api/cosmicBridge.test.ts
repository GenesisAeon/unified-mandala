import cosmicBridge, { connectCosmicBridge } from './cosmicBridge';

global.WebSocket = class {
  onmessage: ((ev: { data: string }) => void) | null = null;
  constructor(public url: string) {}
  send(data: string) {
    this.onmessage?.({ data });
  }
} as any;

test('connectCosmicBridge emits sigil alerts', () => {
  let payload: any = null;
  cosmicBridge.on('sigil:alert', data => {
    payload = data;
  });
  const ws = connectCosmicBridge('ws://test');
  (ws as any).send(JSON.stringify({ type: 'info', message: 'hello' }));
  expect(payload).toEqual({ type: 'info', message: 'hello' });
});
