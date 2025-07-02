import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ResearchAgent } from './ResearchAgent';

test('fetch returns result containing query', async () => {
  const agent = new ResearchAgent();
  const result = await agent.fetch('Test');
  expect(result).toContain('Test');
});
