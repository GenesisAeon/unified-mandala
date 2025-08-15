import { visualizeNullfeld } from './NullfeldVisualization';

test('renders curvature, galaxies and dark matter', () => {
  const viz = visualizeNullfeld({
    curvature: [
      [0.6, 0.1],
      [0.2, 0.7],
    ],
    galaxies: [[1, 0]],
    darkMatter: [
      [0.1, 0.1],
      [0.6, 0.2],
    ],
  });
  expect(viz).toEqual(['^G', 'D^']);
});
