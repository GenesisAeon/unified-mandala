import { NeuronMembrane } from '../neuronMembrane';
import { crepLearningFactor } from '../crepAdapter';

test('reflect and predict', () => {
  const mem = new NeuronMembrane();
  const before = mem.depth;
  mem.reflect();
  expect(mem.depth).toBe(before + 1);
  const out = mem.predict(1, 1);
  expect(typeof out).toBe('number');
});

test('crep factor adapts learning rate', () => {
  const f1 = crepLearningFactor({ coherence: 5, resonance: 5, emergence: 5, poetics: 5 });
  const f2 = crepLearningFactor({ coherence: 9, resonance: 9, emergence: 9, poetics: 9 });
  expect(f2).toBeGreaterThan(f1);
});
