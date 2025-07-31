export class UnifiedLogger {
  constructor(private name: string) {}

  info(msg: string) {
    console.log(`[${this.name}] ${msg}`);
  }

  error(msg: string) {
    console.error(`[${this.name}] ${msg}`);
  }
}
