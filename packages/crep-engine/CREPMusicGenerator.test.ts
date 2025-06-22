import { CREPMusicGenerator } from './CREPMusicGenerator';

const generator = new CREPMusicGenerator();
console.log = jest.fn();

test('plays music with bpm from C score', () => {
  generator.play([{ C: 0.5, R: 0, E: 0, P: 0, timestamp: new Date() }] as any);
  expect((console.log as jest.Mock).mock.calls[0][0]).toContain('BPM');
});
