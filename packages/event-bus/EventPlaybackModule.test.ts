import { EventPlaybackModule } from './EventPlaybackModule';

test('records and replays events', () => {
  const mod = new EventPlaybackModule();
  mod.record({a:1});
  expect(mod.playback()).toEqual([{a:1}]);
});
