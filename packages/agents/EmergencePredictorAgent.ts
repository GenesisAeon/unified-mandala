export class EmergencePredictorAgent {
  private history: number[];
  constructor(history: number[] = []) {
    this.history = history;
  }
  add(value: number) {
    this.history.push(value);
  }
  predict(): number {
    if (this.history.length === 0) return 0;
    const sum = this.history.reduce((a, b) => a + b, 0);
    return sum / this.history.length;
  }
}
