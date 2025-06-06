export type LogListener = (msg: string) => void;

class GlobalLogger {
  private listeners: LogListener[] = [];

  log(msg: string) {
    console.log(msg);
    this.listeners.forEach(l => l(msg));
  }

  subscribe(fn: LogListener) {
    this.listeners.push(fn);
  }
}

export const globalLogger = new GlobalLogger();
