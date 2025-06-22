export interface Level {
  id: string;
  solved: boolean;
}

export class JavaHamsterFlow {
  private levels: Level[];
  constructor(levels: string[] = []) {
    this.levels = levels.map((l) => ({ id: l, solved: false }));
  }
  solve(id: string) {
    const level = this.levels.find((l) => l.id === id);
    if (level) level.solved = true;
  }
  rewardReady() {
    return this.levels.every((l) => l.solved);
  }
}
