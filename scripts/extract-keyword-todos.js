const fs = require('fs');
const path = require('path');

function extractKeywordTodos(file, keywords) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const todos = [];
  for (const conv of data) {
    for (const node of Object.values(conv.mapping)) {
      const parts = node.message?.content?.parts || [];
      for (const part of parts) {
        if (typeof part !== 'string') continue;
        for (const kw of keywords) {
          if (part.includes(kw)) {
            todos.push(part.trim());
            break;
          }
        }
      }
    }
  }
  return todos;
}

if (require.main === module) {
  const file = process.argv[2] || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const keywords = ['Pantheon', 'Boundary', 'VR', 'Resonanzmodule'];
  const results = extractKeywordTodos(file, keywords);
  console.log(JSON.stringify(results, null, 2));
}

module.exports = { extractKeywordTodos };
