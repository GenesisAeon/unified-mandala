export interface VisualizationInput {
  curvature: number[][];
  galaxies: Array<[number, number]>;
  darkMatter: number[][];
}

/**
 * Visualize curvature, galaxies and dark matter density on a simple grid.
 * Galaxies override dark matter and curvature markers.
 */
export function visualizeNullfeld({
  curvature,
  galaxies,
  darkMatter,
}: VisualizationInput): string[] {
  const height = curvature.length;
  const width = curvature[0].length;
  const galaxySet = new Set(galaxies.map(([x, y]) => `${x},${y}`));

  const rows: string[] = [];
  for (let y = 0; y < height; y++) {
    let row = '';
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      if (galaxySet.has(key)) {
        row += 'G';
      } else if (darkMatter[y][x] > 0.5) {
        row += 'D';
      } else {
        row += curvature[y][x] > 0.5 ? '^' : '.';
      }
    }
    rows.push(row);
  }
  return rows;
}
