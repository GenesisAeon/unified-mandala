import { PHI, PI, getPhiTone, getPiTone } from './PhiPiAudio';

test('phi constant', () => {
  expect(Number(PHI.toFixed(5))).toBeCloseTo(1.61803, 5);
});

test('pi constant', () => {
  expect(PI).toBeCloseTo(Math.PI);
});

test('tone helpers', () => {
  const phiTone = getPhiTone(100);
  const piTone = getPiTone(100);
  expect(phiTone.frequency).toBeCloseTo(100 * PHI);
  expect(piTone.frequency).toBeCloseTo(100 * PI);
});
