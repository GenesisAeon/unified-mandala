import { analyzeMaterial, Material } from './MaterialModul';

test('calculates conduction and resonance score', () => {
  const mats: Material[] = [
    { name: 'limestone', conductivity: 2, resonance: 3, thickness: 0.5 },
    { name: 'granite', conductivity: 1.5, resonance: 4, thickness: 1 },
  ];
  const res = analyzeMaterial(mats);
  expect(res[0]).toEqual({ name: 'limestone', conduction: 1, resonanceScore: 6 });
  expect(res[1].conduction).toBeCloseTo(1.5);
});
