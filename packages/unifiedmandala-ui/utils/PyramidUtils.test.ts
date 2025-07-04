import { generateLayer, mirrorLayers } from './PyramidUtils';

test('generateLayer creates nodes', () => {
  const layer = generateLayer(3, 'X');
  expect(layer).toHaveLength(3);
  expect(layer[0].symbol).toBe('X');
});

test('mirrorLayers flips y position', () => {
  const layer = [{ position: [1, 2, 3] as [number, number, number], symbol: 'A' }];
  const mirrored = mirrorLayers([layer]);
  expect(mirrored[0][0].position).toEqual([1, -2, 3]);
});
