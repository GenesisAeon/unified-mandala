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
  title?: string;
  mapping: Record<string, ConversationNode>;
}

export function loadConversations(filePath: string): Conversation[] {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (raw.startsWith('[')) {
    return JSON.parse(raw) as Conversation[];
  }
  return raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Conversation);
}

export function analyzeConversations(filePath: string): ConversationStats {
  const convs = loadConversations(filePath);
  const stats: ConversationStats = {
    conversationCount: convs.length,
    messageCount: 0,
    authorCounts: {},
  };
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
    todos.push(...extractTodosFromConversation(conv, regex));
  }
  return todos;
}

function extractTodosFromConversation(conv: Conversation, regex = /TODO[:]?\s*(.*)/i): string[] {
  const todos: string[] = [];
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
  return todos;
}

export function extractTodosByTitle(filePath: string, title: string): string[] {
  const convs = loadConversations(filePath);
  const conv = convs.find((c) => c.title === title);
  if (!conv) return [];
  return extractTodosFromConversation(conv);
}

export function extractImplicitTodosFromConversations(filePath: string): string[] {
  const convs = loadConversations(filePath);
  const todos: string[] = [];
  const patterns = [
    /TODO[:]?\s*(.*)/i,
    /wir\s+sollten\s+([^\.\n]+)/i,
    /k\u00F6nnten\s+wir\s+([^\.\n]+)/i,
    /sollten\s+wir\s+([^\.\n]+)/i,
    /lass\s+uns\s+([^\.\n]+)/i,
    /wollen\s+wir\s+([^\.\n]+)/i,
  ];

  for (const conv of convs) {
    for (const node of Object.values(conv.mapping)) {
      const msg = node.message;
      if (!msg) continue;
      const parts = msg.content?.parts || [];
      for (const part of parts) {
        if (typeof part !== 'string') continue;
        for (const line of part.split(/\n+/)) {
          for (const re of patterns) {
            const m = re.exec(line);
            if (m) {
              const text = m[1].split(/[\n\.]/)[0].trim();
              if (text) todos.push(text);
              break;
            }
          }
        }
      }
    }
  }
  return Array.from(new Set(todos));
}

export function countTodosByConversation(filePath: string): Record<string, number> {
  const convs = loadConversations(filePath);
  const regex = /TODO[:]?\s*(.*)/i;
  const counts: Record<string, number> = {};
  for (const conv of convs) {
    let count = 0;
    for (const node of Object.values(conv.mapping)) {
      const msg = node.message;
      if (!msg) continue;
      const parts = msg.content?.parts || [];
      for (const part of parts) {
        if (typeof part !== 'string') continue;
        for (const line of part.split(/\n+/)) {
          if (regex.test(line)) count++;
        }
      }
    }
    counts[conv.id] = count;
  }
  return counts;
}
