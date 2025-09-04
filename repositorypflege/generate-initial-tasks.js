#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function readData(file) {
  const ext = path.extname(file).toLowerCase();
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return ext === '.json' ? JSON.parse(raw) : yaml.load(raw);
  } catch (err) {
    console.error(`Failed to parse ${file}:`, err.message);
    return [];
  }
}

function collectFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const stat = fs.statSync(dir);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(dir)) {
      files = files.concat(collectFiles(path.join(dir, entry)));
    }
  } else if (/\.(json|ya?ml)$/i.test(dir)) {
    files.push(dir);
  }
  return files;
}

function gatherTasks() {
  const repoRoot = path.resolve(__dirname, '..');
  const sources = [
    path.join(repoRoot, 'advancedToDo.json'),
    path.join(repoRoot, 'advancedToDo.yaml'),
    path.join(repoRoot, 'advancedToDo_parts')
  ];
  let tasks = [];
  for (const src of sources) {
    const files = collectFiles(src);
    for (const file of files) {
      const data = readData(file);
      if (Array.isArray(data)) tasks = tasks.concat(data);
    }
  }
  return tasks;
}

function isOpen(status) {
  const s = String(status || '').toLowerCase();
  return s && s !== 'done' && s !== 'closed' && s !== 'fertig';
}

const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const outIdx = args.indexOf('--out');
const outFile = outIdx >= 0 ? args[outIdx + 1] : path.join(__dirname, 'initial-tasks.json');
const includeConvos = args.includes('--include-conversations');

const allTasks = gatherTasks();
const openTasks = [];
for (const t of allTasks) {
  if (isOpen(t.status)) {
    const commit = t.commit || t.title || '';
    const p = t.path || null;
    if (!includeConvos) {
      const text = `${commit} ${p || ''}`;
      if (/conversations/i.test(text)) continue;
    }
    openTasks.push({ commit, path: p, task: t.task || t.title || '' });
  }
}

const sliced = openTasks.slice(0, limit);
const output = { generatedAt: new Date().toISOString(), tasks: sliced };
fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
console.log(`Initial tasks written to ${path.relative(process.cwd(), outFile)} (${sliced.length} items)`);
