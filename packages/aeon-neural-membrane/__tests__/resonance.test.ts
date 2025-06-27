import { AeonUniversalMembrane } from '../aeonUniversalMembrane';

test('scanResonance lists energy for each reflection', () => {
  const mem = new AeonUniversalMembrane(undefined, 2);
  const res = mem.scanResonance();
  expect(res.length).toBe(mem.depth);
  expect(res[0]).toHaveProperty('energy');
  expect(res[0]).toHaveProperty('tone');
});

test('resonanceMap includes layer index', () => {
  const mem = new AeonUniversalMembrane(undefined, 3);
  const map = mem.resonanceMap();
  expect(map.length).toBe(mem.depth);
  expect(map[0]).toHaveProperty('layer');
  expect(map[1].layer).toBe(1);
});
