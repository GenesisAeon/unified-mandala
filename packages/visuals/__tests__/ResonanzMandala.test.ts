import { buildResonanzMandala } from '../ResonanzMandala';

test('counts nodes', () => {
  const result = buildResonanzMandala([{ id: 'a', strength: 1 }, { id: 'b', strength: 2 }]);
  expect(result.count).toBe(2);
});
