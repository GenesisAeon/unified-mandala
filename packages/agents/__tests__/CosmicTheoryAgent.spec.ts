import { describe, it, expect, vi, test } from 'vitest';
import axios from 'axios';
import {
  fetchCosmicData,
  analyzeCosmicData,
  callPySRService,
  streamFourierMetricsGrpc,
} from '../CosmicTheoryAgent';

vi.mock('axios');
vi.mock('@grpc/grpc-js', () => {
  return {
    Client: class {
      constructor() {}
      makeServerStreamRequest(_p: any, _s: any, cb: any, _msg: any) {
        const emitter = new (require('events').EventEmitter)();
        (emitter as any).cancel = () => {};
        process.nextTick(() => {
          const data = cb(Buffer.from('{"val":1}'));
          emitter.emit('data', data);
        });
        return emitter;
      }
    },
    credentials: { createInsecure: () => null },
  };
});

describe('fetchCosmicData', () => {
  it('throws on network error', async () => {
    (axios.get as any).mockRejectedValueOnce(new Error('Network Error'));
    await expect(fetchCosmicData('http://example.com')).rejects.toThrow('Network Error');
  });
});

test('analyzes cosmic values', () => {
  const result = analyzeCosmicData([4]);
  expect(result).toBe('y = 2.0');
});

describe('callPySRService', () => {
  it('caches results for identical inputs', async () => {
    (axios.post as any).mockResolvedValueOnce({ data: { equation: 'x' } });
    const eq1 = await callPySRService([1], 'http://pysr');
    const eq2 = await callPySRService([1], 'http://pysr');
    expect(eq1).toBe('x');
    expect(eq2).toBe('x');
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('throws when remote call fails', async () => {
    (axios.post as any).mockRejectedValueOnce(new Error('fail'));
    await expect(callPySRService([2], 'http://pysr')).rejects.toThrow('fail');
  });
});

test('streams fourier metrics via grpc', async () => {
  const received: any[] = [];
  const cancel = await streamFourierMetricsGrpc('localhost:50051', (m) => received.push(m));
  await new Promise((r) => setTimeout(r, 10));
  cancel();
  expect(received).toEqual([{ val: 1 }]);
});
