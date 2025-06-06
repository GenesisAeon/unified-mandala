const fs = require('fs');
const path = require('path');

function parseTodoSigil(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const items = [];
  let current = null;
  for (const line of lines) {
    const idMatch = line.match(/^\s*- id: (.+)$/);
    if (idMatch) {
      current = { id: idMatch[1] };
      items.push(current);
      continue;
    }
    if (!current) continue;
    const descMatch = line.match(/^\s*beschreibung:\s+"?(.*)"?$/);
    if (descMatch) current.beschreibung = descMatch[1];
    const statusMatch = line.match(/^\s*status:\s+(\S+)\s*$/);
    if (statusMatch) current.status = statusMatch[1];
  }
  return items;
}

const checks = {
  'task-1': () => fs.existsSync('package.json'),
  'task-7': () => fs.existsSync('packages/crep-engine/CREPEvaluator.ts'),
  'task-8': () => fs.existsSync('packages/genesis-sigillin-core/SigillinGenerator.ts'),
  'task-9': () => fs.existsSync('packages/unifiedmandala-ui'),
  'task-10': () => fs.existsSync('scripts/aeon.sh'),
  'task-11': () => fs.existsSync('CHRONOPOEM.md'),
  'task-12': () => fs.existsSync('codex/codex-roadmap.yaml'),
  'task-13': () => fs.existsSync('docs/sigils'),
};

function checkTodos(filePath) {
  const items = parseTodoSigil(filePath);
  let allOk = true;
  items.forEach(item => {
    if (item.status === 'erledigt' && checks[item.id]) {
      const ok = checks[item.id]();
      console.log(`${item.id}: ${item.beschreibung} -> ${ok ? 'OK' : 'FEHLT'}`);
      if (!ok) allOk = false;
    }
  });
  return allOk;
}

if (require.main === module) {
  const ok = checkTodos(path.join(__dirname, '../docs/sigils/todo-sigil.yaml'));
  process.exitCode = ok ? 0 : 1;
}

module.exports = { checkTodos };
