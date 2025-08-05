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
}

export function analyzeNewAdvancedConversations(filePath: string): ConversationStats {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let messageCount = 0;
  const authorCounts: Record<string, number> = {};
  let minTime: number | null = null;
  let maxTime: number | null = null;
  let todoCount = 0;
  raw.forEach((session: any) => {
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
    conversationCount: raw.length,
    messageCount,
    authorCounts,
    averageMessagesPerConversation: raw.length ? messageCount / raw.length : 0,
    timeRange: { start: minTime, end: maxTime },
    todoCount,
  };
}

if (require.main === module) {
  const file = process.argv[2] || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const stats = analyzeNewAdvancedConversations(file);
  console.log(`Conversations: ${stats.conversationCount}`);
  console.log(`Messages: ${stats.messageCount}`);
  console.log('Authors:', stats.authorCounts);
}
