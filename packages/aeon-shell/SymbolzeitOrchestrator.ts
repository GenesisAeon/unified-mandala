import mitt, { Emitter } from 'mitt';
import { getSymbolzeitPhase } from '../shared-utils/symbolzeitModulator';

export type SymbolzeitEvents = {
  phaseChange: { phase: string };
};

export class SymbolzeitOrchestrator {
  private emitter: Emitter<SymbolzeitEvents> = mitt<SymbolzeitEvents>();
  private currentPhase: string = getSymbolzeitPhase();
  private timer?: NodeJS.Timeout;

  constructor(private intervalMs = 60000) {}

  start() {
    this.checkPhase();
    this.timer = setInterval(() => this.checkPhase(), this.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  on<E extends keyof SymbolzeitEvents>(event: E, handler: (data: SymbolzeitEvents[E]) => void) {
    this.emitter.on(event, handler);
  }

  private checkPhase() {
    const next = getSymbolzeitPhase();
    if (next !== this.currentPhase) {
      this.currentPhase = next;
      this.emitter.emit('phaseChange', { phase: next });
    }
  }
}

export default SymbolzeitOrchestrator;
