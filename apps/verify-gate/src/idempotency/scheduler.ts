export function scheduleGc(callback: () => void, baseMs: number): void {
  const jitterBase = Number.isFinite(baseMs) && baseMs > 0 ? baseMs : 60000;
  const delay = Math.floor(jitterBase * (0.7 + Math.random() * 0.6));
  setTimeout(() => {
    try {
      callback();
    } finally {
      scheduleGc(callback, baseMs);
    }
  }, delay).unref();
}
