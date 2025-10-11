import { buildResonanzMandala } from '../ResonanzMandala';

test('computes positions from strengths', () => {
  const mandala = buildResonanzMandala([
    { id: 'a', strength: 1 },
    { id: 'b', strength: 2 },
  ]);
  expect(mandala.count).toBe(2);
  expect(mandala.nodes).toHaveLength(2);

  const [a, b] = mandala.nodes;

  expect(a.radius).toBeCloseTo(0.5);
  expect(a.x).toBeCloseTo(0.5);
  expect(a.y).toBeCloseTo(0);

  expect(b.radius).toBeCloseTo(1);
  expect(b.x).toBeCloseTo(-1);
  expect(b.y).toBeCloseTo(0);
});
