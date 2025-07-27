export interface AutoTuneParams {
  frequency: number;
  amplitude: number;
}

export function autoTune(params: AutoTuneParams, feedback: number[]): AutoTuneParams {
  if (feedback.length === 0) return params;
  const avg = feedback.reduce((a, b) => a + b, 0) / feedback.length;
  return {
    frequency: params.frequency * (1 + avg),
    amplitude: params.amplitude * (1 + avg / 2)
  };
}
