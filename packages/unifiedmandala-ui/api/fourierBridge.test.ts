import fourierBridge, { connectFourierBridge } from './fourierBridge';

global.WebSocket = class {
  onmessage: ((ev: { data: string }) => void) | null = null;
  constructor(public url: string) {}
  send(data: string) {
    this.onmessage?.({ data });
  }
  close() {}
} as any;

test('connectFourierBridge emits metric events', () => {
  let payload: any = null;
  fourierBridge.on('fourier:metrics', (data) => {
    payload = data;
  });
  const ws = connectFourierBridge('ws://test');
  (ws as any).send(JSON.stringify({ type: 'fourier-metrics', data: { m: 1 } }));
  expect(payload).toEqual({ m: 1 });
});

test('connectFourierBridge emits svg events', () => {
  let svg: any = null;
  fourierBridge.on('fourier:metrics-svg', (data) => {
    svg = data;
  });
  const ws = connectFourierBridge('ws://test');
  (ws as any).send(
    JSON.stringify({ type: 'fourier-metrics-svg', data: { id: 'x', svg: '<svg/>' } }),
  );
  expect(svg).toEqual({ id: 'x', svg: '<svg/>' });
});
