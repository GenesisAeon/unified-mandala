import { generateNestedLayers } from './generateNestedLayers';

test('generates nested layers with decreasing weight', () => {
  const tree = generateNestedLayers(3);
  expect(tree.index).toBe(0);
  expect(tree.children!.index).toBe(1);
  expect(tree.children!.children!.index).toBe(2);
  expect(tree.children!.children!.children).toBeUndefined();
  expect(tree.weight).toBeGreaterThan(tree.children!.weight);
});
