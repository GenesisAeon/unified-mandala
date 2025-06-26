import mitt from 'mitt';
import { getSymbolzeitPhase } from '../shared-utils/symbolzeitModulator';

export type SymbolzeitManagerEvents = {
  phase: string;
};

export class SymbolzeitManager {
  private emitter = mitt<SymbolzeitManagerEvents>();
  private current = getSymbolzeitPhase();
  private timer?: NodeJS.Timeout;

  constructor(private intervalMs = 60000) {}

  start() {
    this.timer = setInterval(() => {
      const phase = getSymbolzeitPhase();
      if (phase !== this.current) {
        this.current = phase;
        this.emitter.emit('phase', phase);
      }
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  on(handler: (phase: string) => void) {
    this.emitter.on('phase', handler);
  }
}
