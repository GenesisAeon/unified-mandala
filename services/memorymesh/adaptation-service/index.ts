export class HabitWeaver {
  private habits: Record<string, number> = {};

  observe(action: string) {
    this.habits[action] = (this.habits[action] || 0) + 1;
  }

  getHabits() {
    return this.habits;
  }
}
