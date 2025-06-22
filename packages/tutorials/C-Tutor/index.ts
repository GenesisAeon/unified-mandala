export interface Milestone {
  name: string;
  completed: boolean;
}

export class CTutorProgress {
  private milestones: Milestone[];
  constructor(milestones: string[] = []) {
    this.milestones = milestones.map((m) => ({ name: m, completed: false }));
  }
  complete(name: string) {
    const m = this.milestones.find((m) => m.name === name);
    if (m) m.completed = true;
  }
  getProgress() {
    const completed = this.milestones.filter((m) => m.completed).length;
    return completed / this.milestones.length;
  }
}
