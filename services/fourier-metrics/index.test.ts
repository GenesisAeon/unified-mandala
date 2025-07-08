import { TextEncoder } from 'util';
(global as any).TextEncoder = TextEncoder;

jest.mock('ws', () => ({ Server: class { on() {} close() {} } }));
import request from 'supertest';
import { startServer } from './index';
import { FourierLayerEvents } from '../../packages/analysis/FourierLayer';

const PORT = 4110;

describe('fourier metrics server', () => {
  const { server } = startServer(PORT);

  afterAll(() => {
    server.close();
  });

  it('serves latest metrics via REST', async () => {
    FourierLayerEvents.emit('metrics', { id: 'L1', metrics: { maxAmplitude: 1, avgAmplitude: 0.5 } });
    const res = await request(`http://localhost:${PORT}`).get('/fourier/latest');
    expect(res.body.L1.maxAmplitude).toBe(1);
  });
});
