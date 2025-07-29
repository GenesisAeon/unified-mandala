export class ResonanceShadowModule {
  private state = 0;

  integrate(value: number): number {
    this.state = (this.state + value) / 2;
    return this.state;
  }
}
