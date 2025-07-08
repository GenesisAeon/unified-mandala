import { SealCore } from './SealCore';

global.WebSocket = class {
  onopen?: () => void;
  onmessage?: (ev: { data: string }) => void;
  onerror?: (err: any) => void;
  send(data: string) {
    this.onmessage?.({ data });
  }
  close() {}
  constructor(public url: string) {
    setTimeout(() => this.onopen && this.onopen(), 0);
  }
} as any;

test('connect and send data', async () => {
  const core = new SealCore({ url: 'ws://test' });
  let received: any = null;
  core.on('hello', p => (received = p));
  await core.connect();
  core.send('hello', { a: 1 });
  expect(received).toEqual({ a: 1 });
  core.close();
});
