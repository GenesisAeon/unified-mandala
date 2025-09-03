#!/usr/bin/env node
const fs = require('fs');

// Basic argv parsing without extra dependencies
const args = process.argv.slice(2);
const format = args.includes('--json')
  ? 'json'
  : args.includes('--markdown')
    ? 'markdown'
    : 'text';
const fileIdx = args.indexOf('--file');
const progressFile = fileIdx !== -1 && args[fileIdx + 1]
  ? args[fileIdx + 1]
  : 'advancedprogress.json';

try {
  const data = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  const count = (arr) => (Array.isArray(arr) ? arr.length : 0);
  const summary = {
    pending: count(data.pendingTasks),
    done: count(data.progress),
    fractalTodos: count(data.fractalTodos),
    lastUpdated: data.lastUpdated,
    commitHash: data.commitHash,
  };

  if (format === 'json') {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  if (format === 'markdown') {
    console.log('| Metric | Value |');
    console.log('| --- | --- |');
    console.log(`| Pending Tasks | ${summary.pending} |`);
    console.log(`| Completed Tasks | ${summary.done} |`);
    console.log(`| Fractal Todos | ${summary.fractalTodos} |`);
    if (summary.lastUpdated)
      console.log(`| Last Updated | ${summary.lastUpdated} |`);
    if (summary.commitHash)
      console.log(`| Commit | ${summary.commitHash} |`);
    return;
  }

  console.log('Advanced Progress Summary');
  console.log(`Pending Tasks: ${summary.pending}`);
  console.log(`Completed Tasks: ${summary.done}`);
  console.log(`Fractal Todos: ${summary.fractalTodos}`);
  if (summary.lastUpdated) console.log(`Last Updated: ${summary.lastUpdated}`);
  if (summary.commitHash) console.log(`Commit: ${summary.commitHash}`);
} catch (err) {
  console.error(`Failed to read ${progressFile}`, err);
  process.exit(1);
}
