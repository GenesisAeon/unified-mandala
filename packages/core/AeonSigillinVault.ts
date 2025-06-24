export interface PoeticState {
  id: string;
  timestamp: string;
  content: string;
  category?: string;
  params?: Record<string, string | number>;
}

export class AeonSigillinVault {
  private static log: PoeticState[] = [];
  private static transitions: PoeticState[] = [];
  private static resonances: PoeticState[] = [];
  private static guards: PoeticState[] = [];

  static record(state: PoeticState): void {
    this.log.push(state);
  }

  static recordTransition(state: PoeticState): void {
    this.transitions.push(state);
  }

  static recordResonance(state: PoeticState): void {
    this.resonances.push(state);
  }

  static recordGuard(state: PoeticState): void {
    this.guards.push(state);
  }

  static getGuards(n = 5): PoeticState[] {
    return this.guards.slice(-n);
  }

  static latest(n = 5): PoeticState[] {
    return this.log.slice(-n);
  }

  static getTransitions(n = 5): PoeticState[] {
    return this.transitions.slice(-n);
  }

  static getResonances(n = 5): PoeticState[] {
    return this.resonances.slice(-n);
  }
}
