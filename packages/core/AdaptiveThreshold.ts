export class AdaptiveThreshold {
  private value: number;
  private readonly min: number;
  private readonly max: number;
  constructor(initial = 0.5, min = 0.1, max = 0.9) {
    this.value = initial;
    this.min = min;
    this.max = max;
  }
  update(feedback: number) {
    this.value += feedback;
    if (this.value > this.max) this.value = this.max;
    if (this.value < this.min) this.value = this.min;
  }
  get threshold() {
    return this.value;
  }
}
