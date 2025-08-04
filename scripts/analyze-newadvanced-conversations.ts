#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

export interface ConversationStats {
  conversationCount: number;
  messageCount: number;
  authorCounts: Record<string, number>;
}

export function analyzeNewAdvancedConversations(filePath: string): ConversationStats {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let messageCount = 0;
  const authorCounts: Record<string, number> = {};
  raw.forEach((session: any) => {
    const nodes = Object.values(session.mapping || {});
    nodes.forEach((node: any) => {
      const msg = node.message;
      if (msg && msg.author) {
        messageCount++;
        const role = msg.author.role || 'unknown';
        authorCounts[role] = (authorCounts[role] || 0) + 1;
      }
    });
  });
  return {
    conversationCount: raw.length,
    messageCount,
    authorCounts,
  };
}

if (require.main === module) {
  const file = process.argv[2] || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const stats = analyzeNewAdvancedConversations(file);
  console.log(`Conversations: ${stats.conversationCount}`);
  console.log(`Messages: ${stats.messageCount}`);
  console.log('Authors:', stats.authorCounts);
}
