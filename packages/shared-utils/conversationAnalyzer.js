const fs = require('fs');

function loadConversations(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function analyzeConversations(filePath) {
  const convs = loadConversations(filePath);
  const stats = { conversationCount: convs.length, messageCount: 0, authorCounts: {} };
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

function extractTodosFromConversations(filePath) {
  const convs = loadConversations(filePath);
  const todos = [];
  const regex = /TODO[:]?\s*(.*)/i;
  for (const conv of convs) {
    for (const node of Object.values(conv.mapping)) {
      const msg = node.message;
      if (!msg) continue;
      const parts = msg.content?.parts || [];
      for (const part of parts) {
        const m = regex.exec(part);
        if (m) todos.push(m[1].trim());
      }
    }
  }
  return todos;
}

module.exports = { loadConversations, analyzeConversations, extractTodosFromConversations };
