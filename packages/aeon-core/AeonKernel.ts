export type CREPState = {
  coherence: number;
  resonance: number;
  emergence: number;
  poetics: number;
};

export class AeonKernel {
  private state: CREPState = { coherence: 0, resonance: 0, emergence: 0, poetics: 0 };
  private listeners: Array<(s: CREPState) => void> = [];

  setState(state: Partial<CREPState>) {
    this.state = { ...this.state, ...state };
    this.listeners.forEach((l) => l(this.state));
  }

  getState(): CREPState {
    return this.state;
  }

  onChange(cb: (s: CREPState) => void) {
    this.listeners.push(cb);
  }
}
