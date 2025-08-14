/**
 * Translate a resonance value (0..1) into an audible frequency.
 * Inspired by docs/sigils/newadvancedconversations.json recommendation:
 * "ResonanceAudioVisualizer: Übersetzung von Resonanzdaten in Audio-Visualisierungen."
 */
export function toFrequency(value: number): number {
  return 440 * value;
}

/**
 * Map a resonance value (0..1) to an HSL color string.
 */
export function toColor(value: number): string {
  const clamped = Math.max(0, Math.min(1, value));
  const hue = Math.round(clamped * 360);
  return `hsl(${hue}, 100%, 50%)`;
}

export interface AudioVisualSample {
  frequency: number;
  color: string;
}

/**
 * Convert an array of resonance values into audio-visual samples.
 */
export function mapResonance(values: number[]): AudioVisualSample[] {
  return values.map((v) => ({
    frequency: toFrequency(v),
    color: toColor(v),
  }));
}
