#!/usr/bin/env node
const fs = require('fs');
const yaml = require('js-yaml');

// Basic argv parsing without extra dependencies
const args = process.argv.slice(2);
const format = args.includes('--json')
  ? 'json'
  : args.includes('--yaml') || args.includes('--yml')
    ? 'yaml'
    : args.includes('--markdown')
      ? 'markdown'
      : args.includes('--csv')
        ? 'csv'
        : 'text';
const showDetails = args.includes('--details');
const fileIdx = args.indexOf('--file');
const progressFile =
  fileIdx !== -1 && args[fileIdx + 1] ? args[fileIdx + 1] : 'advancedprogress.json';

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

  if (showDetails) {
    summary.lastCommit = data.lastCommit;
    summary.fractalStep = data.fractalStep;
    summary.openBranches = data.openBranches;
    summary.mergeConflicts = data.mergeConflicts;
    if (data.changedFiles && data.changedFiles.length) {
      summary.changedFiles = data.changedFiles;
    }
  }

  if (format === 'json') {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  if (format === 'yaml') {
    console.log(yaml.dump(summary));
    return;
  }

  if (format === 'markdown') {
    console.log('| Metric | Value |');
    console.log('| --- | --- |');
    console.log(`| Pending Tasks | ${summary.pending} |`);
    console.log(`| Completed Tasks | ${summary.done} |`);
    console.log(`| Fractal Todos | ${summary.fractalTodos} |`);
    if (summary.lastUpdated) console.log(`| Last Updated | ${summary.lastUpdated} |`);
    if (summary.commitHash) console.log(`| Commit | ${summary.commitHash} |`);
    if (showDetails) {
      if (summary.lastCommit) console.log(`| Last Commit | ${summary.lastCommit} |`);
      if (summary.fractalStep) console.log(`| Fractal Step | ${summary.fractalStep} |`);
      if (summary.openBranches)
        console.log(`| Open Branches | ${summary.openBranches.join(', ')} |`);
      if (summary.mergeConflicts && summary.mergeConflicts.length)
        console.log(`| Merge Conflicts | ${summary.mergeConflicts.join(', ')} |`);
      if (summary.changedFiles && summary.changedFiles.length)
        console.log(`| Changed Files | ${summary.changedFiles.join(', ')} |`);
    }
    return;
  }

  if (format === 'csv') {
    const headers = ['Pending Tasks', 'Completed Tasks', 'Fractal Todos'];
    const values = [summary.pending, summary.done, summary.fractalTodos];
    if (summary.lastUpdated) {
      headers.push('Last Updated');
      values.push(summary.lastUpdated);
    }
    if (summary.commitHash) {
      headers.push('Commit');
      values.push(summary.commitHash);
    }
    if (showDetails) {
      if (summary.lastCommit) {
        headers.push('Last Commit');
        values.push(summary.lastCommit);
      }
      if (summary.fractalStep) {
        headers.push('Fractal Step');
        values.push(summary.fractalStep);
      }
      if (summary.openBranches) {
        headers.push('Open Branches');
        values.push(summary.openBranches.join('|'));
      }
      if (summary.mergeConflicts && summary.mergeConflicts.length) {
        headers.push('Merge Conflicts');
        values.push(summary.mergeConflicts.join('|'));
      }
      if (summary.changedFiles && summary.changedFiles.length) {
        headers.push('Changed Files');
        values.push(summary.changedFiles.join('|'));
      }
    }
    console.log(headers.join(','));
    console.log(values.join(','));
    return;
  }

  console.log('Advanced Progress Summary');
  console.log(`Pending Tasks: ${summary.pending}`);
  console.log(`Completed Tasks: ${summary.done}`);
  console.log(`Fractal Todos: ${summary.fractalTodos}`);
  if (summary.lastUpdated) console.log(`Last Updated: ${summary.lastUpdated}`);
  if (summary.commitHash) console.log(`Commit: ${summary.commitHash}`);
  if (showDetails) {
    if (summary.lastCommit) console.log(`Last Commit: ${summary.lastCommit}`);
    if (summary.fractalStep) console.log(`Fractal Step: ${summary.fractalStep}`);
    if (summary.openBranches && summary.openBranches.length)
      console.log(`Open Branches: ${summary.openBranches.join(', ')}`);
    if (summary.mergeConflicts && summary.mergeConflicts.length)
      console.log(`Merge Conflicts: ${summary.mergeConflicts.join(', ')}`);
    if (summary.changedFiles && summary.changedFiles.length)
      console.log(`Changed Files: ${summary.changedFiles.join(', ')}`);
  }
} catch (err) {
  console.error(`Failed to read ${progressFile}`, err);
  process.exit(1);
}
