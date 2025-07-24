export class ResonanceAutoTuner {
  tune(current: number, target: number): number {
    return (current + target) / 2;
  }
}
