// @jest-environment node
jest.unmock('ws');
jest.resetModules();
import { startFourierMetricsServer } from './FourierMetricsServer';
import { FourierLayer } from './FourierLayer';
import WebSocket from 'ws';
import { once } from 'events';

describe('FourierMetricsServer cache', () => {
  it.skip('sends cached metrics to new connections', async () => {
    const port = 4060;
    const server = startFourierMetricsServer(port);
    const layer = new FourierLayer('C1', 1, [1, 0, 1, 0], { depth: 4 });
    layer.analyze();

    const ws = new WebSocket(`ws://localhost:${port}`);
    const messages: any[] = [];
    ws.on('message', (m) => messages.push(JSON.parse(m.toString())));
    await once(ws, 'open');
    await new Promise((r) => setTimeout(r, 50));
    expect(messages.some((m) => m.type === 'fourier-metrics')).toBe(true);
    ws.close();
    server.close();
  });
});
