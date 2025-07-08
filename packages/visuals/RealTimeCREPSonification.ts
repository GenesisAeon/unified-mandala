export interface SonifyOptions {
  duration?: number;
  ctx?: AudioContext;
}

export function sonifyCREP(
  crep: number,
  { duration = 0.5, ctx }: SonifyOptions = {}
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
  osc.frequency.value = 220 + crep * 220;
  osc.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
  return osc;
}
