export interface ErrorEvent {
  message: string;
  timestamp: number;
}

export function logError(message: string): ErrorEvent {
  const evt = { message, timestamp: Date.now() };
  if (typeof console !== 'undefined') {
    console.error('PyramidUI:', message);
  }
  return evt;
}

export function fallbackSynth(freq = 440, duration = 0.2): void {
  if (typeof AudioContext === 'undefined') return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.frequency.value = freq;
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function highlightElement(el: HTMLElement): void {
  el.style.outline = '2px solid red';
}
