export type CREPCallback = (score: number) => void;

export class CREPIntegration {
  private callbacks: CREPCallback[] = [];

  onUpdate(cb: CREPCallback): void {
    this.callbacks.push(cb);
  }

  emit(score: number): void {
    this.callbacks.forEach((cb) => cb(score));
  }
}
