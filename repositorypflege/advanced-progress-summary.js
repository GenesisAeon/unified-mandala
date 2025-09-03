#!/usr/bin/env node
const fs = require('fs');
try {
  const data = JSON.parse(fs.readFileSync('advancedprogress.json', 'utf8'));
  const count = (arr) => Array.isArray(arr) ? arr.length : 0;
  const summary = {
    pending: count(data.pendingTasks),
    done: count(data.progress),
    fractalTodos: count(data.fractalTodos),
    lastUpdated: data.lastUpdated,
    commitHash: data.commitHash,
  };
  console.log('Advanced Progress Summary');
  console.log(`Pending Tasks: ${summary.pending}`);
  console.log(`Completed Tasks: ${summary.done}`);
  console.log(`Fractal Todos: ${summary.fractalTodos}`);
  if (summary.lastUpdated) console.log(`Last Updated: ${summary.lastUpdated}`);
  if (summary.commitHash) console.log(`Commit: ${summary.commitHash}`);
} catch (err) {
  console.error('Failed to read advancedprogress.json', err);
  process.exit(1);
}
