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
    expect(stats.averageMessagesPerConversation).toBe(1);
    expect(stats.timeRange.start).toBe(1234567890);
    expect(stats.timeRange.end).toBe(1234567890);
    expect(stats.todoCount).toBe(1);
    expect(stats.titles).toEqual(['Sample']);
  });

  it('filters by specified titles', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-multi.json'
    );
    const stats = analyzeNewAdvancedConversations(file, ['Second']);
    expect(stats.conversationCount).toBe(1);
    expect(stats.messageCount).toBe(1);
    expect(stats.authorCounts.assistant).toBe(1);
    expect(stats.titles).toEqual(['Second']);
    expect(stats.todoCount).toBe(0);
  });
});
