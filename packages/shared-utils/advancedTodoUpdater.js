const fs = require('fs');
const YAML = require('yaml');
const { extractTodosFromConversations } = require('./conversationAnalyzer');

function updateAdvancedTodo(convFile, yamlFile, jsonFile) {
  const todos = extractTodosFromConversations(convFile);
  const entries = Array.from(new Set(todos)).map(t => ({
    commit: t,
    path: '',
    task: t,
    test: ''
  }));

  const loadYaml = f => {
    if (fs.existsSync(f)) {
      const data = YAML.parse(fs.readFileSync(f, 'utf8'));
      return Array.isArray(data) ? data : [];
    }
    return [];
  };
  const loadJson = f => {
    if (fs.existsSync(f)) {
      return JSON.parse(fs.readFileSync(f, 'utf8'));
    }
    return [];
  };
  const merge = (existing, add) => {
    const known = new Set(existing.map(e => e.commit));
    for (const e of add) {
      if (!known.has(e.commit)) {
        existing.push(e);
        known.add(e.commit);
      }
    }
    return existing;
  };
  const yamlData = merge(loadYaml(yamlFile), entries);
  const jsonData = merge(loadJson(jsonFile), entries);
  fs.writeFileSync(yamlFile, YAML.stringify(yamlData));
  fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2));
  return entries;
}
module.exports = { updateAdvancedTodo };
