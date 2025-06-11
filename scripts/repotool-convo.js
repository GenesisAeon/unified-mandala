const fs = require('fs');
const path = require('path');

const convFile = path.join(__dirname, '../docs/sigils/conversations.json');
const progressFile = path.join(__dirname, '../docs/sigils/conversations-progress.json');

function loadConversations(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw);
}

function analyzeConversations(convs) {
  let messageCount = 0;
  const authorCounts = {};
  convs.forEach(conv => {
    for (const node of Object.values(conv.mapping || {})) {
      const msg = node.message;
      const content = msg && msg.content && msg.content.parts && msg.content.parts[0];
      if (content && content !== '') {
        messageCount++;
        const role = (msg.author && msg.author.role) ? msg.author.role : 'unknown';
        authorCounts[role] = (authorCounts[role] || 0) + 1;
      }
    }
  });
  return { conversationCount: convs.length, messageCount, authorCounts };
}

function extractTodos(convs) {
  const todos = [];
  const regex = /TODO[:]?\s*(.*)/i;
  convs.forEach(conv => {
    for (const node of Object.values(conv.mapping || {})) {
      const msg = node.message;
      if (!msg) continue;
      const parts = (msg.content && msg.content.parts) || [];
      for (const part of parts) {
        const m = regex.exec(part);
        if (m) todos.push(m[1].trim());
      }
    }
  });
  return todos;
}

function updateProgress(convs, file) {
  let data = [];
  if (fs.existsSync(file)) {
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {}
  }
  let changed = false;
  convs.forEach(c => {
    if (!data.some(p => p.id === c.id)) {
      data.push({ id: c.id, processedAt: new Date().toISOString() });
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }
}

function run() {
  const convs = loadConversations(convFile);
  const stats = analyzeConversations(convs);
  console.log('Conversations:', stats.conversationCount);
  console.log('Messages:', stats.messageCount);
  console.log('Authors:', stats.authorCounts);
  const todos = extractTodos(convs);
  console.log(`Found ${todos.length} TODO hints in conversations.`);
  updateProgress(convs, progressFile);
  console.log('Progress file updated.');
}

if (require.main === module) {
  run();
}

module.exports = { run };
