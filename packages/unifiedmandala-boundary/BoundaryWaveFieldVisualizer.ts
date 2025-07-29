export interface WaveSource {
  amplitude: number;
  frequency: number;
  phase: number;
}

export class BoundaryWaveFieldVisualizer {
  constructor(private sources: WaveSource[] = []) {}

  addSource(source: WaveSource) {
    this.sources.push(source);
  }

  calculateField(x: number, t: number): number {
    return this.sources.reduce((sum, s) => {
      return sum + s.amplitude * Math.sin(2 * Math.PI * s.frequency * t + s.phase) * Math.exp(-x);
    }, 0);
  }
}
