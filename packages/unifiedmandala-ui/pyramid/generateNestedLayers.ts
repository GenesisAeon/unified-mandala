import { PHI } from './PyramidWeighting';

export interface LayerNode {
  index: number;
  weight: number;
  children?: LayerNode;
}

export function generateNestedLayers(levels: number): LayerNode {
  if (levels <= 0) {
    return { index: 0, weight: 0 };
  }

  const build = (level: number): LayerNode => {
    const weight = Number((1 / Math.pow(PHI, level)).toFixed(6));
    if (level + 1 < levels) {
      return { index: level, weight, children: build(level + 1) };
    }
    return { index: level, weight };
  };

  return build(0);
}
