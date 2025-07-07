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
    showErrorMarker();
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
    showErrorMarker();
    fallbackTone(crep);
  }
}

export function fallbackTone(crep: number) {
  if (typeof console !== 'undefined') {
    console.log('fallback tone', crep);
  }
}

export function showErrorMarker() {
  if (typeof document === 'undefined') return;
  let el = document.getElementById('sonification-error');
  if (!el) {
    el = document.createElement('div');
    el.id = 'sonification-error';
    el.style.position = 'fixed';
    el.style.bottom = '10px';
    el.style.right = '10px';
    el.style.background = 'rgba(255,0,0,0.8)';
    el.style.color = '#fff';
    el.style.padding = '4px 8px';
    el.style.zIndex = '1000';
    el.textContent = 'Audio error';
    document.body.appendChild(el);
    setTimeout(() => {
      el && el.remove();
    }, 2000);
  }
}
