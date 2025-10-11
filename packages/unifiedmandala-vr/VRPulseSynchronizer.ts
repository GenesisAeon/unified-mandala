export class VRPulseSynchronizer {
  private listeners: Array<(pulse: number) => void> = [];

  sync(pulse: number) {
    this.listeners.forEach((cb) => cb(pulse));
  }

  onPulse(cb: (pulse: number) => void) {
    this.listeners.push(cb);
  }
}
