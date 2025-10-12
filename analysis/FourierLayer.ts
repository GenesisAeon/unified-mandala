export type FourierOptions = { depth?: number };

export class FourierLayer {
  constructor(
    public id: string,
    public version: number,
    public series: number[],
    public opts: FourierOptions = {},
  ) {}

  analyze(): { metrics: { maxAmplitude: number; mean: number; count: number } } {
    const data = Array.isArray(this.series) ? this.series : [];
    const abs = data.map((v) => Math.abs(Number(v) || 0));
    const maxAmplitude = abs.length ? Math.max(...abs) : 0;
    const sum = data.reduce((a, b) => a + (Number(b) || 0), 0);
    const mean = data.length ? sum / data.length : 0;
    return { metrics: { maxAmplitude, mean, count: data.length } };
  }
}

