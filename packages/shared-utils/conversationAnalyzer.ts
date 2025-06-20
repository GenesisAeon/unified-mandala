import fs from 'fs';

export interface ConversationStats {
  conversationCount: number;
  messageCount: number;
  authorCounts: Record<string, number>;
}

interface ConversationNode {
  message?: {
    author?: { role?: string };
    content?: { parts?: string[] };
  };
}

interface Conversation {
  id: string;
  mapping: Record<string, ConversationNode>;
}

export function loadConversations(filePath: string): Conversation[] {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as Conversation[];
}

export function analyzeConversations(filePath: string): ConversationStats {
  const convs = loadConversations(filePath);
  const stats: ConversationStats = { conversationCount: convs.length, messageCount: 0, authorCounts: {} };
  for (const conv of convs) {
    for (const node of Object.values(conv.mapping)) {
      const msg = node.message;
      const content = msg?.content?.parts?.[0];
      if (content && content !== '') {
        stats.messageCount++;
        const role = msg?.author?.role || 'unknown';
        stats.authorCounts[role] = (stats.authorCounts[role] || 0) + 1;
      }
    }
  }
  return stats;
}

export function extractTodosFromConversations(filePath: string): string[] {
  const convs = loadConversations(filePath);
  const todos: string[] = [];
  const regex = /TODO[:]?\s*(.*)/i;
  for (const conv of convs) {
    for (const node of Object.values(conv.mapping)) {
      const msg = node.message;
      if (!msg) continue;
      const parts = msg.content?.parts || [];
      for (const part of parts) {
        if (typeof part !== 'string') continue;
        for (const line of part.split(/\n+/)) {
          const m = regex.exec(line);
          if (m) {
            const text = m[1].split(/[\n\.]/)[0].trim();
            if (text) todos.push(text);
          }
        }
      }
    }
  }
  return todos;
}
