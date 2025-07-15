import { TextEncoder } from 'util';
(global as any).TextEncoder = TextEncoder;

const mockServer = {
  on: jest.fn(),
  close: jest.fn(),
};
jest.mock('ws', () => ({ Server: jest.fn(() => mockServer) }));
import request from 'supertest';
import { startServer } from './index';
import { FourierLayerEvents } from '../../packages/analysis/FourierLayer';

const PORT = 4110;

describe('fourier metrics server', () => {
  const { server, stop } = startServer(PORT);

  afterAll(() => {
    stop();
  });

  it('serves latest metrics via REST', async () => {
    FourierLayerEvents.emit('metrics', { id: 'L1', metrics: { maxAmplitude: 1, avgAmplitude: 0.5 } });
    const res = await request(`http://localhost:${PORT}`).get('/fourier/latest');
    expect(res.body.L1.maxAmplitude).toBe(1);
  });

  it('sends cached metrics on websocket connection', () => {
    const messages: any[] = [];
    FourierLayerEvents.emit('metrics', { id: 'L2', metrics: { maxAmplitude: 2, avgAmplitude: 1 } });

    // capture connection handler and invoke
    const handler = mockServer.on.mock.calls.find(c => c[0] === 'connection')?.[1];
    expect(handler).toBeDefined();
    const socket = { send: (msg: string) => messages.push(JSON.parse(msg)), on: jest.fn() } as any;
    handler(socket);

    expect(messages.some(m => m.id === 'L2')).toBe(true);
  });
});
