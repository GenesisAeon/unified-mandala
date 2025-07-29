export class ResonanceShadowModule {
  private enabled = false;

  enable() {
    this.enabled = true;
  }

  isEnabled() {
    return this.enabled;
  }
}
