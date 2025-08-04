import { describe, it, expect } from 'vitest';
import path from 'path';
import { analyzeNewAdvancedConversations } from './analyze-newadvanced-conversations';

describe('analyzeNewAdvancedConversations', () => {
  it('summarizes sample conversation data', () => {
    const file = path.join(__dirname, '../tests/fixtures/newadvanced-sample.json');
    const stats = analyzeNewAdvancedConversations(file);
    expect(stats.conversationCount).toBe(1);
    expect(stats.messageCount).toBe(1);
    expect(stats.authorCounts.user).toBe(1);
  });
});
