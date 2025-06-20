export function syncSymbolzeit(phase: string, callback: (phase: string) => void): void {
  setTimeout(() => {
    callback(phase);
  }, 0);
}
