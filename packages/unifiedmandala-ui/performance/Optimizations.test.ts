import { getAudioContext, cacheLayer, getCachedLayer } from './Optimizations';

beforeAll(() => {
  (global as any).AudioContext = class {
    close() {}
  };
});

test('getAudioContext caches instance', () => {
  const ctx1 = getAudioContext('a');
  const ctx2 = getAudioContext('a');
  expect(ctx1).toBe(ctx2);
});

test('layer cache', () => {
  cacheLayer('layer', { id: 1 });
  expect(getCachedLayer('layer')).toEqual({ id: 1 });
});
