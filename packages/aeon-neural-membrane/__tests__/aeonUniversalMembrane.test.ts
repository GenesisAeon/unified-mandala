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

