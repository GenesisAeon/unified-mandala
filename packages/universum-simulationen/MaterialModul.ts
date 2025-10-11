export interface Material {
  name: string;
  conductivity: number; // thermal conductivity factor
  resonance: number; // resonance coefficient
  thickness: number; // in meters
}

export interface MaterialAnalysis {
  name: string;
  conduction: number;
  resonanceScore: number;
}

export function analyzeMaterial(layers: Material[]): MaterialAnalysis[] {
  return layers.map((layer) => ({
    name: layer.name,
    conduction: layer.conductivity * layer.thickness,
    resonanceScore: layer.resonance / (layer.thickness || 1),
  }));
}
