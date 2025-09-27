#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const repo = process.cwd();
const root = repo;
const diaryDir = path.join(root, 'docs', 'fraktal', 'diary');
const feedbackDir = path.join(root, 'docs', 'fraktal', 'codexfeedback');
const indexPath = path.join(root, 'docs', 'fraktal', 'index.md');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function findRootFiles() {
  const names = fs.readdirSync(root);
  const diary = names.filter((n) => /^fraktal\d+\.md$/i.test(n) || /^fraktal-zyklus\.md$/i.test(n));
  const feedback = names.filter((n) => /^codexfeedback-fraktal\d+\.ya?ml$/i.test(n));
  return { diary, feedback };
}

function createStub(oldPath, newRelPath) {
  const ext = path.extname(oldPath).toLowerCase();
  try {
    if (ext === '.md') {
      const md = `Dieses Dokument wurde verschoben nach ${newRelPath}.

Bitte aktualisiere alte Links. Direktlink: [${newRelPath}](${newRelPath})
`;
      fs.writeFileSync(oldPath, md);
    } else if (ext === '.yaml' || ext === '.yml') {
      const y = `# moved: ${newRelPath}\n# Hinweis: Diese Datei wurde in die Fraktal-Struktur verschoben. Bitte Links aktualisieren.`;
      fs.writeFileSync(oldPath, y);
    } else {
      const msg = `Moved -> ${newRelPath}`;
      fs.writeFileSync(oldPath, msg);
    }
  } catch {}
}

function moveIfMissing(from, to) {
  if (!fs.existsSync(from)) return false;
  if (fs.existsSync(to)) return false;
  fs.renameSync(from, to);
  // create a lightweight redirect/link stub at old location
  const newRel = path.relative(path.dirname(from), to).replace(/\\/g, '/');
  createStub(from, newRel);
  return true;
}

function generateIndex() {
  const diaryFiles = fs.existsSync(diaryDir)
    ? fs
        .readdirSync(diaryDir)
        .filter((n) => n.endsWith('.md'))
        .sort()
    : [];
  const feedbackFiles = fs.existsSync(feedbackDir)
    ? fs
        .readdirSync(feedbackDir)
        .filter((n) => /\.ya?ml$/i.test(n))
        .sort()
    : [];
  const lines = [];
  lines.push('Fraktal Diary Index');
  lines.push('');
  lines.push('- Location: `docs/fraktal`');
  lines.push('');
  if (diaryFiles.length) {
    lines.push('Diary');
    for (const f of diaryFiles) {
      lines.push(`- ${f} — docs/fraktal/diary/${f}`);
    }
    lines.push('');
  }
  if (feedbackFiles.length) {
    lines.push('Codexfeedback');
    for (const f of feedbackFiles) {
      lines.push(`- ${f} — docs/fraktal/codexfeedback/${f}`);
    }
    lines.push('');
  }
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, lines.join('\n'));
}

function main() {
  ensureDir(diaryDir);
  ensureDir(feedbackDir);

  // Check staged files to run only when relevant
  let staged = [];
  try {
    staged = execSync('git diff --cached --name-only', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {}

  const { diary, feedback } = findRootFiles();
  const hasRootCandidates = diary.length > 0 || feedback.length > 0;
  const stagedRelevant = staged.some(
    (p) =>
      /^(fraktal\d+\.md|fraktal-zyklus\.md|codexfeedback-fraktal\d+\.ya?ml)$/i.test(p) ||
      /^docs\/fraktal\/(diary|codexfeedback)\//.test(p),
  );
  if (!hasRootCandidates && !stagedRelevant) {
    console.log('[fraktal-organize] No relevant changes detected. Skipping.');
    return;
  }
  let moved = 0;
  for (const n of diary) {
    const from = path.join(root, n);
    const to = path.join(diaryDir, n);
    if (moveIfMissing(from, to)) moved++;
  }
  for (const n of feedback) {
    const from = path.join(root, n);
    const to = path.join(feedbackDir, n);
    if (moveIfMissing(from, to)) moved++;
  }
  generateIndex();
  console.log(
    `[fraktal-organize] OK. Moved ${moved} files. Index at ${path.relative(root, indexPath)}`,
  );
}

main();
