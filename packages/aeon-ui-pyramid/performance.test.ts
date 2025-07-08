import { getAudioContext, LayerCache } from './performance';

global.AudioContext = class {} as any;

test('reuses audio context', () => {
  const ctx1 = getAudioContext();
  const ctx2 = getAudioContext();
  expect(ctx1).toBe(ctx2);
});

test('caches layer', () => {
  const cache = new LayerCache<number>();
  cache.set('a', 1);
  expect(cache.get('a')).toBe(1);
});
