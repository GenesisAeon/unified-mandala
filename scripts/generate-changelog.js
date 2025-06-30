#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

function getLastTag() {
  try {
    return execSync('git describe --tags --abbrev=0').toString().trim();
  } catch {
    return '';
  }
}

function getCommits(since) {
  const range = since ? `${since}..HEAD` : 'HEAD';
  const output = execSync(`git log ${range} --pretty=format:"- %s"`).toString().trim();
  return output;
}

function updateChangelog(commits) {
  if (!commits) {
    console.log('No new commits');
    return;
  }
  const file = 'CHANGELOG.md';
  const content = fs.readFileSync(file, 'utf-8').split('\n');
  const idx = content.findIndex(line => line.startsWith('## [Unreleased]'));
  if (idx === -1) {
    console.error('Unreleased section not found');
    return;
  }
  const insertPos = idx + 1;
  content.splice(insertPos, 0, commits, '');
  fs.writeFileSync(file, content.join('\n'));
  console.log('CHANGELOG.md updated');
}

function run() {
  const tag = getLastTag();
  const commits = getCommits(tag);
  updateChangelog(commits);
}

if (require.main === module) {
  run();
}

module.exports = { run };
