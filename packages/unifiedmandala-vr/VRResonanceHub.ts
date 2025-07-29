export type ResonanceListener = (value: number) => void;

export class VRResonanceHub {
  private listeners: ResonanceListener[] = [];

  join(listener: ResonanceListener) {
    this.listeners.push(listener);
  }

  broadcast(value: number) {
    this.listeners.forEach(l => l(value));
  }
}
