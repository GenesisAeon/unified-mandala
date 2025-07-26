export class SelfReflectionAgent {
  private logs: string[] = [];

  record(message: string) {
    this.logs.push(message);
  }

  summarize(): string {
    return this.logs.join('\n');
  }
}
