export interface Milestone {
  name: string;
  completed: boolean;
}

export class CTutorProgress {
  private milestones: Milestone[];
  private awarded: string[] = [];
  private awardCallback?: (name: string) => void;

  constructor(milestones: string[] = [], awardCallback?: (name: string) => void) {
    this.milestones = milestones.map((m) => ({ name: m, completed: false }));
    this.awardCallback = awardCallback;
  }

  complete(name: string) {
    const m = this.milestones.find((m) => m.name === name);
    if (m && !m.completed) {
      m.completed = true;
      this.awarded.push(name);
      this.awardCallback?.(name);
    }
  }

  getProgress() {
    const completed = this.milestones.filter((m) => m.completed).length;
    return this.milestones.length === 0 ? 0 : completed / this.milestones.length;
  }

  getAwardedSigils() {
    return [...this.awarded];
  }
}
