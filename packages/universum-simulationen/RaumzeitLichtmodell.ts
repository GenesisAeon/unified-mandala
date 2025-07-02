export interface LightSource {
  x: number;
  y: number;
  intensity: number;
}

/**
 * Compute additive light overlap grid from multiple light sources.
 * The result can be used to approximate local spacetime interference.
 */
export function computeLightOverlap(sources: LightSource[], gridSize: number): number[][] {
  const grid: number[][] = [];
  for (let y = 0; y < gridSize; y++) {
    const row: number[] = [];
    for (let x = 0; x < gridSize; x++) {
      let value = 0;
      for (const s of sources) {
        const dx = x - s.x;
        const dy = y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        value += s.intensity / (1 + dist);
      }
      row.push(value);
    }
    grid.push(row);
  }
  return grid;
}
