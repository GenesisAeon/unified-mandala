export interface ResonanceParameters {
  frequency: number;
  intensity: number;
}

export class ResonanceAutoTuner {
  tune(params: ResonanceParameters, feedback: number[]): ResonanceParameters {
    if (feedback.length === 0) return params;
    const avg = feedback.reduce((a, b) => a + b, 0) / feedback.length;
    return {
      frequency: params.frequency * (1 + avg),
      intensity: params.intensity * (1 + avg / 2),
    };
  }
}
