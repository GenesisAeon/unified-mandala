/**
 * Sonify CREP values in real time.
 * Derived from docs/sigils/newadvancedconversations.json recommendation:
 * "RealTimeCREPSonification".
 */
export interface SonifyOptions {
  duration?: number;
  ctx?: AudioContext;
  /** Output volume 0..1 */
  volume?: number;
}

export function sonifyCREP(
  crep: number,
  { duration = 0.5, ctx, volume = 1 }: SonifyOptions = {}
): OscillatorNode | undefined {
  const AudioCtx =
    (typeof window !== 'undefined' &&
      ((window as any).AudioContext || (window as any).webkitAudioContext)) ||
    AudioContext;
  let audioCtx = ctx;
  try {
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
  } catch {
    return undefined;
  }
  if (!audioCtx) return undefined;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  gain.gain.value = volume;
  osc.frequency.value = 220 + crep * 220;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
  return osc;
}
