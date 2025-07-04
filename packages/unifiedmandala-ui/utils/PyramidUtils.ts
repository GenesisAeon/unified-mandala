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
