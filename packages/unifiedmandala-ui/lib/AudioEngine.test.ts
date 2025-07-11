import { AudioEngine } from './AudioEngine';

describe('AudioEngine', () => {
  it('plays and stops frequency', () => {
    const engine = new AudioEngine();
    expect(engine.play(440)).toBe('play 440');
    engine.stop();
  });
});
