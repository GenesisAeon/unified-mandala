import { AeonUniversalMembrane } from '../aeonUniversalMembrane';
import { CREPSignature } from '../crepAdapter';

test('train and predict through universal membrane', () => {
  const mem = new AeonUniversalMembrane(2);
  const data: [number, number][] = [
    [115, 66],
    [175, 78]
  ];
  const answers = [1, 0];
  const crep: CREPSignature = { coherence: 6, resonance: 6, emergence: 6, poetics: 6 };
  mem.train(data, answers, crep);
  const out = mem.predict(115, 66);
  expect(typeof out).toBe('number');
  expect(mem.depth).toBeGreaterThan(1);
});

test('harmonize reflects on high energy', () => {
  const mem = new AeonUniversalMembrane(0);
  const data: [number, number][] = [
    [115, 66],
    [175, 78]
  ];
  const answers = [1, 0];
  const res = mem.harmonize(data, answers, 'hello world', 0);
  expect(res.energy).toBeGreaterThan(0);
  expect(typeof res.tone).toBe('string');
  expect(mem.depth).toBeGreaterThan(0); // increased due to threshold 0
});

