const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function getLastCommitMessage() {
  return execSync('git log -1 --pretty=%s').toString().trim();
}

function getOpenBranches() {
  const output = execSync('git branch --format="%(refname:short)"').toString();
  return output.split('\n').map(b => b.trim()).filter(b => b && b !== 'main');
}

function getMergeConflicts() {
  try {
    const output = execSync('git diff --name-only --diff-filter=U').toString();
    return output.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function updateProgress(step) {
  const progressFile = path.join(__dirname, '../advancedprogress.json');
  let data = {};
  if (fs.existsSync(progressFile)) {
    data = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  }
  data.lastCommit = getLastCommitMessage();
  data.fractalStep = step || data.fractalStep || '';
  data.openBranches = getOpenBranches();
  data.mergeConflicts = getMergeConflicts();
  fs.writeFileSync(progressFile, JSON.stringify(data, null, 2));
  console.log('advancedprogress.json updated');
}

if (require.main === module) {
  const step = process.argv[2] || 'implementiert';
  updateProgress(step);
}

module.exports = { updateProgress };
