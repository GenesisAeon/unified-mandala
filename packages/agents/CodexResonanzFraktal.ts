import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export class CodexResonanzFraktal {
  private log: string[] = [];
  constructor(private hub = GPTEventHub) {}

  fractalize(input: string): string {
    const entry = `fractal:${input}`;
    this.log.push(entry);
    this.hub.emit('codex:fraktal', entry);
    return entry;
  }

  history(): string[] {
    return this.log;
  }
}
