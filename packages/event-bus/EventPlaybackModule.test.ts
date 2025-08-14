import { EventPlaybackModule } from './EventPlaybackModule';

test('records, filters and clears events', () => {
  const mod = new EventPlaybackModule();
  mod.record({ type: 'test', payload: { a: 1 } });
  mod.record({ type: 'other', payload: { b: 2 } });

  const all = mod.playback();
  expect(all.length).toBe(2);
  expect(all[0]).toHaveProperty('timestamp');

  const filtered = mod.playback('test');
  expect(filtered).toEqual([all[0]]);

  mod.clear();
  expect(mod.playback().length).toBe(0);
});
