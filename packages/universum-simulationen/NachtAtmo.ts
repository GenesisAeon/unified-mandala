export interface Star {
  x: number;
  y: number;
  layer: number;
}

/**
 * Generate layered star positions for a simple night atmosphere simulation.
 * Each layer represents a parallax depth.
 */
export function generateNachtAtmo(
  layers: number,
  starsPerLayer: number,
  width: number,
  height: number,
): Star[] {
  const stars: Star[] = [];
  for (let layer = 0; layer < layers; layer++) {
    for (let i = 0; i < starsPerLayer; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        layer,
      });
    }
  }
  return stars;
}
