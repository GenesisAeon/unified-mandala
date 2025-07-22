const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { extractTodosFromConversations } = require('../packages/shared-utils/conversationAnalyzer');

function extractTopicTodos(convFile, keywords, yamlFile, jsonFile) {
  const todos = extractTodosFromConversations(convFile);
  const kw = keywords.map(k => k.toLowerCase());
  const filtered = todos.filter(t => kw.some(k => t.toLowerCase().includes(k)));
  const entries = filtered.map(task => ({ commit: task, path: '', task, test: '' }));

  const merge = (file, data) => {
    let arr = [];
    if (fs.existsSync(file)) {
      try { arr = file.endsWith('.yaml') ? YAML.parse(fs.readFileSync(file, 'utf8')) : JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
    }
    if (!Array.isArray(arr)) arr = [];
    const known = new Set(arr.map(e => e.commit));
    for (const e of data) {
      if (!known.has(e.commit)) { arr.push(e); known.add(e.commit); }
    }
    fs.writeFileSync(file, file.endsWith('.yaml') ? YAML.stringify(arr) : JSON.stringify(arr, null, 2));
  };

  merge(yamlFile, entries);
  merge(jsonFile, entries);
  return entries;
}

if (require.main === module) {
  const convFile = path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const yamlFile = path.join(__dirname, '../advancedToDo.yaml');
  const jsonFile = path.join(__dirname, '../advancedToDo.json');
  const keywords = process.argv.slice(2);
  if (keywords.length === 0) {
    console.error('Usage: node extract-topic-todos.js <keyword1> <keyword2> ...');
    process.exit(1);
  }
  const entries = extractTopicTodos(convFile, keywords, yamlFile, jsonFile);
  console.log(`Extracted ${entries.length} tasks for keywords: ${keywords.join(', ')}`);
}

module.exports = { extractTopicTodos };
