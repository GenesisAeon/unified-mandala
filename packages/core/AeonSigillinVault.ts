export interface PoeticState {
  id: string;
  timestamp: string;
  content: string;
}

export class AeonSigillinVault {
  private static log: PoeticState[] = [];

  static record(state: PoeticState): void {
    this.log.push(state);
  }

  static latest(n = 5): PoeticState[] {
    return this.log.slice(-n);
  }
}
