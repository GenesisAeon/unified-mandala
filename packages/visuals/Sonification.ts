export function playCREPTone(crep: number) {
  const AudioCtx = (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) || AudioContext;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  osc.frequency.value = 440 * crep;
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1);
}
