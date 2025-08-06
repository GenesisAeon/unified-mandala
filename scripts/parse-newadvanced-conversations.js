const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { grepJsonArrayFile } = require('../packages/shared-utils/jsonFragmenter');

function extractSessionTodos(filePath, titles) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const titleSet = new Set(titles);
  const tasks = [];
  raw.forEach(session => {
    if (!titleSet.has(session.title)) return;
    const nodes = Object.values(session.mapping || {});
    nodes.forEach(node => {
      const parts = node.message && node.message.content && node.message.content.parts;
      if (!parts) return;
      parts.forEach(part => {
        part.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (
            /TODO:/i.test(trimmed) ||
            /scripts\/(sync-todo-progress|parse-advanced-conversations)/.test(trimmed) ||
            /(Feature-Extraktion|Progress-Tracking|CI\/CD|Deployment|Modul-Integrationen|UI-Upgrades)/i.test(trimmed)
          ) {
            const taskText = trimmed.replace(/^(?:[-*]|\d+\.)\s*/, '');
            tasks.push({
              commit: trimmed,
              path: '',
              task: taskText,
              test: '',
              status: 'planned'
            });
          }
        });
      });
    });
  });
  return tasks;
}

function parseNewAdvancedConversations(filePath, destDir, keyword = 'TODO') {
  const regex = new RegExp(keyword, 'i');
  return grepJsonArrayFile(filePath, destDir, regex);
}

if (require.main === module) {
  const file = path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const dest = path.join(__dirname, '../GenesisAeonZIPMEM/newadvancedconversations');
  const arg = process.argv[2];
  if (arg === '--extract-todos') {
    const titlesIndex = process.argv.indexOf('--titles');
    const titles =
      titlesIndex >= 0
        ? process.argv[titlesIndex + 1]
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [
            'Sigillin Entwicklungszusammenfassung',
            'Programm testen Feedback',
          ];
    const tasks = extractSessionTodos(file, titles);
    const outJson = path.join(__dirname, '../advancedToDo_parts/advancedToDo.part6.json');
    const outYaml = path.join(__dirname, '../advancedToDo_parts/advancedToDo.part6.yaml');
    fs.writeFileSync(outJson, JSON.stringify(tasks, null, 2));
    fs.writeFileSync(outYaml, yaml.dump(tasks));
    console.log(`Extracted ${tasks.length} tasks to ${outJson}`);
  } else {
    const keyword = arg || 'TODO';
    const matches = parseNewAdvancedConversations(file, dest, keyword);
    console.log(`Parsed ${matches.length} fragments containing '${keyword}'. Output: ${dest}`);
  }
}

module.exports = { parseNewAdvancedConversations, extractSessionTodos };
