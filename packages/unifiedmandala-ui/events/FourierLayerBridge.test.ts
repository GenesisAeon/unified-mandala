import bridge, { connectFourierLayerBridge } from './FourierLayerBridge';

global.WebSocket = class {
  onmessage: ((ev: { data: string }) => void) | null = null;
  constructor(public url: string) {}
  send(data: string) {
    this.onmessage?.({ data });
  }
  close() {}
} as any;

test('connectFourierLayerBridge relays events', () => {
  let metrics: any = null;
  let svg: any = null;
  bridge.on('fourier:metrics', d => (metrics = d));
  bridge.on('fourier:metrics-svg', d => (svg = d));
  const ws = connectFourierLayerBridge('ws://test');
  (ws as any).send(
    JSON.stringify({ type: 'fourier-metrics', data: { a: 1 } })
  );
  (ws as any).send(
    JSON.stringify({ type: 'fourier-metrics-svg', data: { id: 't', svg: '<svg />' } })
  );
  expect(metrics).toEqual({ a: 1 });
  expect(svg).toEqual({ id: 't', svg: '<svg />' });
});
