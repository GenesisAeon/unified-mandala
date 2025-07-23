export class GraphDBPersistence {
  private rules: any[] = [];

  async saveRule(rule: any): Promise<void> {
    this.rules.push(rule);
  }

  async getRules(): Promise<any[]> {
    return this.rules;
  }
}
