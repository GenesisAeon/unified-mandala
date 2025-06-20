export class PoeticReactorAgent {
  private haikus: string[] = [
    'Silent dawn arrives',
    'Waves whisper to ancient stones',
    'Dreams echo in light'
  ];

  constructor(private threshold = 80) {}

  observe(crepValue: number): string | null {
    if (crepValue >= this.threshold) {
      return this.generateHaiku();
    }
    return null;
  }

  private generateHaiku(): string {
    return this.haikus[Math.floor(Math.random() * this.haikus.length)];
  }
}
