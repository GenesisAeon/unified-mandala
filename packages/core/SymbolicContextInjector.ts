export class SymbolicContextInjector {
  private context: Record<string, unknown>;

  constructor(initial: Record<string, unknown> = {}) {
    this.context = { ...initial };
  }

  inject(symbol: string, value: unknown): void {
    this.context[symbol] = value;
  }

  injectAll(entries: Record<string, unknown>): void {
    this.context = { ...this.context, ...entries };
  }

  get(symbol: string): unknown {
    return this.context[symbol];
  }

  getContext(): Record<string, unknown> {
    return { ...this.context };
  }
}
export default SymbolicContextInjector;
