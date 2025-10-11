const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const {
  extractImplicitTodosFromConversations,
} = require('../packages/shared-utils/conversationAnalyzer');

const src = process.argv[2] || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
const outYaml = process.argv[3] || path.join(__dirname, '../docs/sigils/implicit-todos.yaml');

const todos = extractImplicitTodosFromConversations(src);
const data = todos.map((t) => ({ commit: t, path: '', task: t, test: '' }));
fs.writeFileSync(outYaml, YAML.stringify(data));
console.log(`Extracted ${data.length} implicit todos to ${path.relative(process.cwd(), outYaml)}`);
