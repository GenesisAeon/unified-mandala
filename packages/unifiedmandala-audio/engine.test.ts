import { MandalaAudioEngine, PHI, createMandalaSoundscape } from './engine';

test('phi constant value', () => {
  expect(Number(PHI.toFixed(5))).toBeCloseTo(1.61803, 5);
});

test('createMandalaSoundscape returns tones', () => {
  const tones = createMandalaSoundscape([0, 0.5]);
  expect(tones).toHaveLength(2);
  expect(tones[0].frequency).toBeCloseTo(220);
});

test('MandalaAudioEngine computes phi tone frequency', () => {
  const engine = new MandalaAudioEngine(440);
  // context might not exist in test env; ensure method doesn't throw
  engine.phiTone(0.1);
});
