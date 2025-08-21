export interface BudgetRecord {
  date: string; // YYYY-MM-DD
  spent: number;
}

/**
 * BudgetGuard tracks token spend per agent and enforces daily limits.
 */
export class BudgetGuard {
  private records: Map<string, BudgetRecord> = new Map();

  constructor(private dailyLimit: number) {}

  /**
   * Attempt to record a token spend for an agent.
   * @returns true if within budget, false if limit exceeded.
   */
  spend(agentId: string, tokens: number): boolean {
    const today = new Date().toISOString().slice(0, 10);
    const record = this.records.get(agentId);
    if (!record || record.date !== today) {
      this.records.set(agentId, { date: today, spent: tokens });
      return tokens <= this.dailyLimit;
    }

    const newTotal = record.spent + tokens;
    if (newTotal > this.dailyLimit) {
      return false;
    }
    record.spent = newTotal;
    return true;
  }

  /** Get the amount spent today for the given agent. */
  getSpent(agentId: string): number {
    const record = this.records.get(agentId);
    const today = new Date().toISOString().slice(0, 10);
    return record && record.date === today ? record.spent : 0;
  }

  /** Reset budget tracking for an agent or all agents. */
  reset(agentId?: string): void {
    if (agentId) {
      this.records.delete(agentId);
    } else {
      this.records.clear();
    }
  }
}
