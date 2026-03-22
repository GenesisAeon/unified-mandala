#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const eventName = process.env.GITHUB_EVENT_NAME ?? '';
const actor = process.env.GITHUB_ACTOR ?? '';
const ref = process.env.GITHUB_REF ?? '';
const sha = process.env.GITHUB_SHA ?? '';

const eventPath = process.env.GITHUB_EVENT_PATH;
let beforeSha = process.env.GITHUB_EVENT_BEFORE ?? '';
if (!beforeSha && eventPath) {
  try {
    const payload = JSON.parse(readFileSync(eventPath, 'utf8'));
    if (typeof payload?.before === 'string') {
      beforeSha = payload.before;
    }
  } catch (error) {
    console.warn('[ai-guard] Unable to read event payload:', error);
  }
}

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}

function info(message) {
  console.log(`[ai-guard] ${message}`);
}

function diffNames(range) {
  if (!range) {
    return [];
  }
  const output = execSync(`git diff --name-only ${range}`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return output
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function ensureNoScratchArtifacts(files) {
  const hasScratch = files.some((file) => file.startsWith('.ai-scratch/'));
  if (hasScratch) {
    fail('Files under .ai-scratch/ must not be committed. Use scratch:// storage at runtime.');
  }
}

if (eventName === 'push' && ref === 'refs/heads/main' && /bot/i.test(actor)) {
  fail(`Bot pushes to main are forbidden (actor=${actor}). Open a pull request with human review.`);
}

if (eventName === 'pull_request') {
  const baseRef = process.env.GITHUB_BASE_REF ?? 'main';
  try {
    execSync(`git fetch --no-tags --depth=1 origin ${baseRef}`, { stdio: 'ignore' });
  } catch (error) {
    console.warn(`[ai-guard] fetch origin/${baseRef} failed:`, error.message);
  }
  let files;
  try {
    files = diffNames(`origin/${baseRef}...HEAD`);
  } catch {
    info(`No merge base with origin/${baseRef}; skipping diff check.`);
    process.exit(0);
  }
  ensureNoScratchArtifacts(files);
  info(`PR guard passed (${files.length} file${files.length === 1 ? '' : 's'} changed).`);
  process.exit(0);
}

if (eventName === 'push') {
  if (!beforeSha || /^0+$/.test(beforeSha)) {
    info('No before SHA provided (branch creation); skipping diff check.');
    process.exit(0);
  }
  const files = diffNames(`${beforeSha}..${sha}`);
  ensureNoScratchArtifacts(files);
  info(`Push guard passed (${files.length} file${files.length === 1 ? '' : 's'} changed).`);
  process.exit(0);
}

info('Event not handled (no guard triggered).');
