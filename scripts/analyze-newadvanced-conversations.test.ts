import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { execSync } from 'child_process';
import {
  analyzeNewAdvancedConversations,
  analyzeNewAdvancedConversationsStream,
} from './analyze-newadvanced-conversations';

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
    const file = path.join(__dirname, '../tests/fixtures/newadvanced-multi.json');
    const stats = analyzeNewAdvancedConversations(file, ['Second']);
    expect(stats.conversationCount).toBe(1);
    expect(stats.messageCount).toBe(1);
    expect(stats.authorCounts.assistant).toBe(1);
    expect(stats.titles).toEqual(['Second']);
    expect(stats.todoCount).toBe(0);
  });

  it('respects start and count parameters', () => {
    const file = path.join(__dirname, '../tests/fixtures/newadvanced-multi.json');
    const stats = analyzeNewAdvancedConversations(file, undefined, 1, 1);
    expect(stats.conversationCount).toBe(1);
    expect(stats.titles).toEqual(['Second']);
  });

  it('writes JSON stats when using --json flag', () => {
    const file = path.join(__dirname, '../tests/fixtures/newadvanced-sample.json');
    const out = path.join(os.tmpdir(), 'newadvanced-stats.json');
    const script = path.join(__dirname, 'analyze-newadvanced-conversations.ts');
    execSync(`npx ts-node --transpile-only ${script} ${file} --json ${out}`);
    const written = JSON.parse(fs.readFileSync(out, 'utf8'));
    expect(written.conversationCount).toBe(1);
  });

  it('honors --start and --count flags', () => {
    const file = path.join(__dirname, '../tests/fixtures/newadvanced-multi.json');
    const out = path.join(os.tmpdir(), 'newadvanced-stats2.json');
    const script = path.join(__dirname, 'analyze-newadvanced-conversations.ts');
    execSync(`npx ts-node --transpile-only ${script} ${file} --start 1 --count 1 --json ${out}`);
    const written = JSON.parse(fs.readFileSync(out, 'utf8'));
    expect(written.conversationCount).toBe(1);
    expect(written.titles).toEqual(['Second']);
  });

  it('streams conversation data without loading entire file', async () => {
    const file = path.join(__dirname, '../tests/fixtures/newadvanced-multi.json');
    const stats = await analyzeNewAdvancedConversationsStream(file);
    expect(stats.conversationCount).toBe(2);
    expect(stats.messageCount).toBe(2);
    expect(stats.authorCounts.user).toBe(1);
    expect(stats.authorCounts.assistant).toBe(1);
    expect(stats.todoCount).toBe(1);
    expect(stats.titles).toEqual(['First', 'Second']);
  });
});
