export interface FourierLayerPlugin {
  transform(data: number[]): number[];
}

export class ScalePlugin implements FourierLayerPlugin {
  constructor(private factor: number) {}
  transform(data: number[]): number[] {
    return data.map(v => v * this.factor);
  }
}
