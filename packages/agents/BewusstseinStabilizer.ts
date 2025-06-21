export class BewusstseinStabilizer {
  constructor(public threshold = 0.5) {}

  adjust(value: number): number {
    this.threshold += value > this.threshold ? 0.05 : -0.05;
    return this.threshold;
  }
}
