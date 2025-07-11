export class AudioEngine {
  private current = 0;
  play(freq: number): string {
    this.current = freq;
    return `play ${freq}`;
  }
  stop() {
    this.current = 0;
  }
}
