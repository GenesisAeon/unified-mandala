import { computeLightOverlap } from './RaumzeitLichtmodell';

test('computeLightOverlap returns grid with expected size', () => {
  const grid = computeLightOverlap([{ x: 0, y: 0, intensity: 1 }], 3);
  expect(grid.length).toBe(3);
  expect(grid[0].length).toBe(3);
});
