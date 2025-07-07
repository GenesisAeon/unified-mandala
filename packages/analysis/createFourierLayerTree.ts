import { FourierLayer, FourierLayerConfig } from './FourierLayer';

export interface LayerNode {
  id: string;
  children: FourierLayer[];
}

export function createFourierLayerTree(inputs: number[][], config: FourierLayerConfig): LayerNode {
  const root: LayerNode = { id: 'root', children: [] };
  root.children = inputs.map((arr, i) => new FourierLayer(`F-L${i}`, 1, arr, config));
  return root;
}
