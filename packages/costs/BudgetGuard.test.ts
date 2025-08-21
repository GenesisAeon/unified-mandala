import { describe, it, expect, beforeEach } from 'vitest';
import { BudgetGuard } from './BudgetGuard';

describe('BudgetGuard', () => {
  let guard: BudgetGuard;
  beforeEach(() => {
    guard = new BudgetGuard(100);
  });

  it('allows spend within limit and tracks totals', () => {
    expect(guard.spend('agentA', 60)).toBe(true);
    expect(guard.spend('agentA', 30)).toBe(true);
    expect(guard.getSpent('agentA')).toBe(90);
  });

  it('blocks spend exceeding limit', () => {
    expect(guard.spend('agentB', 80)).toBe(true);
    expect(guard.spend('agentB', 30)).toBe(false);
    expect(guard.getSpent('agentB')).toBe(80);
  });
});
