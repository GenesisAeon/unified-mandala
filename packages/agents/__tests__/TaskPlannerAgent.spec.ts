import { describe, it, expect, vi } from 'vitest';
import { TaskPlannerAgent } from '../TaskPlannerAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('TaskPlannerAgent', () => {
  it('logs planning action', async () => {
    const agent = new TaskPlannerAgent();
    await agent.handle({ id: 'T-Plan', description: '...' });
    expect(console.log).toHaveBeenCalledWith('📋 TaskPlanner → Planung für T-Plan');
  });
});
