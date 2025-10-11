const fs = require('fs');
const path = require('path');

const progressFile = path.join(__dirname, '../advancedprogress.json');
const todoFile = path.join(__dirname, '../advancedToDo.yaml');
const chronoFile = path.join(__dirname, '../CHRONOPOEM.md');
const outDir = path.join(__dirname, '../docs/crep');
const outFile = path.join(outDir, 'overview.md');

function loadProgress() {
  if (!fs.existsSync(progressFile)) return {};
  return JSON.parse(fs.readFileSync(progressFile, 'utf8'));
}

function loadTodos() {
  if (!fs.existsSync(todoFile)) return [];
  const raw = fs.readFileSync(todoFile, 'utf8');
  return raw.split(/\n-/).filter((line) => line.trim().startsWith('commit:'));
}

function loadChrono() {
  if (!fs.existsSync(chronoFile)) return '';
  return fs.readFileSync(chronoFile, 'utf8');
}

function buildOverview() {
  const progress = loadProgress();
  const todos = loadTodos();
  const chrono = loadChrono();
  const lines = [];

  lines.push('# CREP Overview');
  if (progress.lastCommit) {
    lines.push(`- **Last Commit**: ${progress.lastCommit}`);
  }
  if (progress.fractalStep) {
    lines.push(`- **Fractal Step**: ${progress.fractalStep}`);
  }
  lines.push(`- **Open Branches**: ${(progress.openBranches || []).join(', ')}`);
  lines.push(`- **Merge Conflicts**: ${(progress.mergeConflicts || []).length}`);
  lines.push(`- **ToDo Entries**: ${todos.length}`);
  lines.push('\n---\n');
  lines.push('## Chronopoem');
  lines.push(chrono);
  return lines.join('\n');
}

function writeOverview() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const content = buildOverview();
  fs.writeFileSync(outFile, content);
  console.log(`CREP documentation written to ${outFile}`);
}

if (require.main === module) {
  writeOverview();
}
