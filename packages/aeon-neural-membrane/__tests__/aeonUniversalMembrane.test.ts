import { AeonUniversalMembrane } from '../aeonUniversalMembrane';
import { CREPSignature } from '../crepAdapter';
import { NeuronMembrane } from '../neuronMembrane';

test('train and predict through universal membrane', () => {
  const mem = new AeonUniversalMembrane(undefined, 2);
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
  const mem = new AeonUniversalMembrane(undefined, 0);
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

test('trainAsync resolves and predicts', async () => {
  const mem = new AeonUniversalMembrane(undefined, 0);
  const data: [number, number][] = [
    [10, 20],
    [30, 40]
  ];
  const answers = [0, 1];
  const crep: CREPSignature = { coherence: 5, resonance: 5, emergence: 5, poetics: 5 };
  await mem.trainAsync(data, answers, crep);
  expect(typeof mem.predict(10, 20)).toBe('number');
});

test('constructor accepts injected membrane', () => {
  const base = new NeuronMembrane();
  const mem = new AeonUniversalMembrane(base, 0);
  expect(mem.depth).toBe(1);
});

test('harmonize throws on mismatched data', () => {
  const mem = new AeonUniversalMembrane(undefined, 0);
  expect(() =>
    mem.harmonize([[1, 2]], [1, 0], 'hi')
  ).toThrow('harmonize: Data und Answers m');
});

