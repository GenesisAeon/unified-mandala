export interface PyramidLayer {
  id: string;
  name: string;
  weight?: number;
}

export class PyramidCore {
  private layers: PyramidLayer[] = [];

  addLayer(layer: PyramidLayer) {
    this.layers.push(layer);
  }

  getLayers() {
    return this.layers;
  }
}
