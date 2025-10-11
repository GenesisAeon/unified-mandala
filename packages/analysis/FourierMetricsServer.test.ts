// @jest-environment node

jest.mock('ws', () => ({
  default: class {
    constructor() {}
    on() {}
    send() {}
    close() {}
  },
  Server: class {
    on() {}
    close() {}
  },
}));
import { startFourierMetricsServer } from './FourierMetricsServer';
import { FourierLayer } from './FourierLayer';
import { WebSocket } from 'ws';
import { once } from 'events';

describe('FourierMetricsServer', () => {
  it.skip('broadcasts metrics via websocket', async () => {
    const server = startFourierMetricsServer(4050);
    const ws = new WebSocket('ws://localhost:4050');
    const messages: any[] = [];
    ws.on('message', (m) => messages.push(JSON.parse(m.toString())));
    await once(ws, 'open');
    const layer = new FourierLayer('test', 1, [1, 0, 1, 0], { depth: 4 });
    layer.analyze();
    await new Promise((r) => setTimeout(r, 50));
    expect(messages.some((m) => m.type === 'fourier-metrics')).toBe(true);
    ws.close();
    server.close();
  });
});
