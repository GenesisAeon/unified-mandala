export interface SynthParams {
  frequencies: number[];
  gain: number;
}

export class ResonanceModuleSynth {
  constructor(private sampleRate = 44100) {}

  synthesize(params: SynthParams, lengthSeconds = 1): Float32Array {
    const totalSamples = Math.floor(this.sampleRate * lengthSeconds);
    const buffer = new Float32Array(totalSamples);
    for (let i = 0; i < totalSamples; i++) {
      const t = i / this.sampleRate;
      let val = 0;
      for (const f of params.frequencies) {
        val += Math.sin(2 * Math.PI * f * t);
      }
      buffer[i] = (val / params.frequencies.length) * params.gain;
    }
    return buffer;
  }
}
