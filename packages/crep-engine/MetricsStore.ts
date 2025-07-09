export class MetricsStore {
  private values: number[] = [];
  add(value: number) {
    this.values.push(value);
  }
  average(): number {
    if (this.values.length === 0) return 0;
    return this.values.reduce((a,b)=>a+b,0)/this.values.length;
  }
}
