export interface Level {
  id: string;
  solved: boolean;
  hint?: string;
}

/**
 * JavaHamsterFlow simulates a small learning game where each level can provide
 * a coaching hint and awards a sigil once all levels are solved. The class is
 * intentionally lightweight so it can be used in unit tests without any GPT
 * calls while still reflecting the high level idea of an "AI coach".
 */
export class JavaHamsterFlow {
  private levels: Level[];
  private sigil: string | null = null;

  constructor(levels: { id: string; hint?: string }[] = []) {
    this.levels = levels.map((l) => ({ id: l.id, solved: false, hint: l.hint }));
  }

  solve(id: string) {
    const level = this.levels.find((l) => l.id === id);
    if (level) level.solved = true;
  }

  /**
   * Returns a hint for the requested level. If no hint was provided, a default
   * motivational message is returned to emulate an AI coach response.
   */
  coach(id: string): string {
    const level = this.levels.find((l) => l.id === id);
    return level?.hint ?? 'Keep going, little hamster!';
  }

  rewardReady() {
    return this.levels.every((l) => l.solved);
  }

  /**
   * Awards a simple sigil string once all levels are solved. Subsequent calls
   * return the same sigil value.
   */
  awardSigil(): string | null {
    if (this.rewardReady()) {
      if (!this.sigil) {
        // Basic sigil pattern composed from solved level ids
        const pattern = this.levels.map((l) => l.id).join('-');
        this.sigil = `sigil-${pattern}`;
      }
      return this.sigil;
    }
    return null;
  }
}
