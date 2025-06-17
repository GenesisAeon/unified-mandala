export class AeonKIResonanzAgent {
  private resonanzLog: string[] = [];

  constructor(private emit: (event: string, payload: any) => void = () => {}) {}

  start(message: string): void {
    this.resonanzLog.push(message);
    this.emit('aeon:resonanz', message);
  }

  getLog(): string[] {
    return this.resonanzLog;
  }
}
