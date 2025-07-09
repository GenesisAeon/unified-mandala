import { createTonePlayground } from '../TonePlayground';

test('plays tone', () => {
  const tp = createTonePlayground();
  expect(tp.playTone(440)).toBe('playing 440');
  tp.stop();
});
