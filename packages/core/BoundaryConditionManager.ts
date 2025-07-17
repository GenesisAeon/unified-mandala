export class BoundaryConditionManager {
  private conditions: Set<string> = new Set();

  addCondition(cond: string): void {
    this.conditions.add(cond);
  }

  has(cond: string): boolean {
    return this.conditions.has(cond);
  }

  checkAll(list: string[]): boolean {
    return list.every(c => this.conditions.has(c));
  }
}
