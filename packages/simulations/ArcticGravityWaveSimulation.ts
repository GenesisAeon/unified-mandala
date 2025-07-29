export interface WaveParameters {
  amplitude: number;
  frequency: number;
  phase?: number;
}

export class ArcticGravityWaveSimulation {
  private params: WaveParameters;
  constructor(params: WaveParameters) {
    this.params = { phase: 0, ...params };
  }

  /** Compute wave height at time t in seconds */
  height(t: number): number {
    const { amplitude, frequency, phase } = this.params;
    return amplitude * Math.sin(2 * Math.PI * frequency * t + (phase ?? 0));
  }
}
