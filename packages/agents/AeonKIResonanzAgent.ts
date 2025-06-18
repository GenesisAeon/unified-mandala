import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export class AeonKIResonanzAgent {
  private resonanzLog: string[] = [];

  constructor(private emit: (event: string, payload: any) => void = () => {}) {}

  start(message: string): void {
    this.resonanzLog.push(message);
    this.broadcast(message);
  }

  resonate(message: string): number {
    this.resonanzLog.push(message);
    return message.length;
  }

  broadcast(message: string): void {
    this.emit('aeon:resonanz', message);
    GPTEventHub.emit('aeon:resonanz', message);
  }

  getLog(): string[] {
    return this.resonanzLog;
  }
}
