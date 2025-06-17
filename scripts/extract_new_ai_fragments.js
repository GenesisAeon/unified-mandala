const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const oldFile = path.join(__dirname, '../docs/sigils/conversations.json');
const newFile = path.join(__dirname, '../docs/sigils/conversations_new_AI_Plan_with_Code.json');
const todoJsonPath = path.join(__dirname, '../ToDoAI.json');
const todoYamlPath = path.join(__dirname, '../ToDoAI.yaml');

const oldConvs = JSON.parse(fs.readFileSync(oldFile, 'utf8'));
const newConvs = JSON.parse(fs.readFileSync(newFile, 'utf8'));
const oldIds = new Set(oldConvs.map(c => c.id));
const diffConvs = newConvs.filter(c => !oldIds.has(c.id));

function convToText(conv){
  const nodes = Object.values(conv.mapping);
  const msgs = nodes.filter(n => n.message && n.message.content && n.message.content.parts && n.message.content.parts[0] !== '');
  msgs.sort((a,b)=> (a.message.create_time||0)-(b.message.create_time||0));
  return msgs.map(m => `${m.message.author.role || 'unknown'}: ${m.message.content.parts.join('\n')}`).join('\n');
}

let todoJson = { fragments: [] };
if (fs.existsSync(todoJsonPath)) todoJson = JSON.parse(fs.readFileSync(todoJsonPath, 'utf8'));
let todoYaml = { todos: [] };
if (fs.existsSync(todoYamlPath)) todoYaml = yaml.parse(fs.readFileSync(todoYamlPath, 'utf8'));

const startIndex = todoJson.fragments.length > 0 ? parseInt(todoJson.fragments[todoJson.fragments.length-1].id.match(/Fragment_(\d+)/)[1]) + 1 : 1;

diffConvs.forEach((conv, idx) => {
  const idNum = startIndex + idx;
  const fragId = `Fragment_${idNum}_${conv.title.replace(/\s+/g, '_')}`;
  const content = convToText(conv);
  todoJson.fragments.push({ id: fragId, title: conv.title, content, tags: ["Agent", "AI", "CREP"] });
  todoYaml.todos.push({ id: fragId, implement: 'packages/agents/', priority: 'medium', next_commit: false });
});

fs.writeFileSync(todoJsonPath, JSON.stringify(todoJson, null, 2));
fs.writeFileSync(todoYamlPath, yaml.stringify(todoYaml));
console.log(`Added ${diffConvs.length} fragments.`);
