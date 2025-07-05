export function playCREPTone(crep: number) {
  const AudioCtx =
    (typeof window !== 'undefined' &&
      (window.AudioContext || (window as any).webkitAudioContext)) ||
    AudioContext;
  let ctx: AudioContext | undefined;
  try {
    ctx = new AudioCtx();
  } catch (err) {
    console.warn('Audio context init failed, using fallback tone', err);
    return fallbackTone(crep);
  }
  try {
    const osc = ctx.createOscillator();
    osc.frequency.value = 440 * crep;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  } catch (err) {
    console.error('Sonification error', err);
    fallbackTone(crep);
  }
}

export function fallbackTone(crep: number) {
  if (typeof console !== 'undefined') {
    console.log('fallback tone', crep);
  }
}
