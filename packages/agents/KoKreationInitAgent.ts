import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export class KoKreationInitAgent {
  private initialized = false;
  private log: string[] = [];

  constructor(private hub = GPTEventHub) {}

  init(message: string): void {
    this.initialized = true;
    this.log.push(message);
    this.hub.emit('kocreation:init', message);
  }

  getLog(): string[] {
    return this.log;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
