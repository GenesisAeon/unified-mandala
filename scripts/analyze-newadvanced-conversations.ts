#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

export interface ConversationStats {
  conversationCount: number;
  messageCount: number;
  authorCounts: Record<string, number>;
  averageMessagesPerConversation: number;
  timeRange: { start: number | null; end: number | null };
  todoCount: number;
  titles: string[];
}

export function analyzeNewAdvancedConversations(
  filePath: string,
  filterTitles?: string[]
): ConversationStats {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const sessions = Array.isArray(filterTitles)
    ? raw.filter((s: any) => filterTitles.includes(s.title))
    : raw;
  let messageCount = 0;
  const authorCounts: Record<string, number> = {};
  let minTime: number | null = null;
  let maxTime: number | null = null;
  let todoCount = 0;
  const collectedTitles: string[] = [];
  sessions.forEach((session: any) => {
    collectedTitles.push(session.title || 'Untitled');
    const nodes = Object.values(session.mapping || {});
    nodes.forEach((node: any) => {
      const msg = node.message;
      if (msg && msg.author) {
        messageCount++;
        const role = msg.author.role || 'unknown';
        authorCounts[role] = (authorCounts[role] || 0) + 1;
        const ct = (msg as any).create_time;
        if (typeof ct === 'number') {
          minTime = minTime === null ? ct : Math.min(minTime, ct);
          maxTime = maxTime === null ? ct : Math.max(maxTime, ct);
        }
        const parts: string[] = msg.content?.parts || [];
        const text = parts.join(' ');
        const matches = text.match(/TODO/gi);
        if (matches) todoCount += matches.length;
      }
    });
  });
  return {
    conversationCount: sessions.length,
    messageCount,
    authorCounts,
    averageMessagesPerConversation: sessions.length
      ? messageCount / sessions.length
      : 0,
    timeRange: { start: minTime, end: maxTime },
    todoCount,
    titles: collectedTitles,
  };
}

if (require.main === module) {
  const fileArgIndex = process.argv.findIndex((a: string) => !a.startsWith('--'));
  const file =
    fileArgIndex > 1
      ? process.argv[fileArgIndex]
      : path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const summaryIndex = process.argv.indexOf('--summary');
  const summaryPath = summaryIndex >= 0 ? process.argv[summaryIndex + 1] : null;
  const titlesArgIndex = process.argv.indexOf('--titles');
  const titleList =
    titlesArgIndex >= 0
      ? process.argv[titlesArgIndex + 1]
          .split(',')
          .map((t: string) => t.trim())
      : undefined;
  const stats = analyzeNewAdvancedConversations(file, titleList);
  console.log(`Conversations: ${stats.conversationCount}`);
  console.log(`Messages: ${stats.messageCount}`);
  console.log('Authors:', stats.authorCounts);
  console.log('Titles:', stats.titles);
  if (summaryPath) {
    const lines = [
      '# New Advanced Conversations Stats',
      '',
      `- Conversations: ${stats.conversationCount}`,
      `- Messages: ${stats.messageCount}`,
      '- Authors:',
      ...Object.entries(stats.authorCounts).map(
        ([role, count]) => `  - ${role}: ${count}`
      ),
      '- Titles:',
      ...stats.titles.map((t) => `  - ${t}`),
      `- TODOs: ${stats.todoCount}`,
      `- Time range: ${stats.timeRange.start ?? 'n/a'} - ${stats.timeRange.end ?? 'n/a'}`,
    ];
    fs.writeFileSync(summaryPath, lines.join('\n') + '\n');
    console.log(`Summary written to ${summaryPath}`);
  }
}
