export class MandalaOrchestratorControl {
  constructor(private services: Array<{ run: () => void }>) {}

  startAll() {
    this.services.forEach((s) => s.run());
  }
}
