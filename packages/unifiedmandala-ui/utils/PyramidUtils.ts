export interface PyramidNode {
  position: [number, number, number];
  symbol: string;
}

export type PyramidLayerNodes = PyramidNode[];

export function generateLayer(size: number, symbol: string): PyramidLayerNodes {
  return Array.from({ length: size }, (_, i) => ({
    position: [i, i, 0],
    symbol,
  }));
}

export function mirrorLayers(layers: PyramidLayerNodes[]): PyramidLayerNodes[] {
  return layers.map(layer =>
    layer.map(node => ({
      ...node,
      position: [node.position[0], -node.position[1], node.position[2]],
    }))
  );
}

export function generateWeightedLayer(
  size: number,
  symbol: string,
  index: number
): (PyramidNode & { weight: number })[] {
  const base = Math.PI * Math.E;
  const weightFactor = Math.pow((1 + Math.sqrt(5)) / 2, index) / base;
  return Array.from({ length: size }, (_, i) => ({
    position: [i, i, 0],
    symbol,
    weight: Number(((i + 1) * weightFactor).toFixed(6)),
  }));
}
