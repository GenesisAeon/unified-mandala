import { AeonUniversalMembrane } from '../aeonUniversalMembrane';

test('scanResonance lists energy for each reflection', () => {
  const mem = new AeonUniversalMembrane(2);
  const res = mem.scanResonance();
  expect(res.length).toBe(mem.depth);
  expect(res[0]).toHaveProperty('energy');
  expect(res[0]).toHaveProperty('tone');
});
