const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const YAML = require('yaml');

function run() {
  const repoRoot = path.resolve(__dirname, '..');
  const commit = execSync('git rev-parse HEAD').toString().trim();
  const memoryDir = path.join(repoRoot, 'GenesisAeonZIPMEM', commit);
  if (fs.existsSync(memoryDir)) {
    console.log('Memory for this commit already exists.');
    return;
  }
  fs.mkdirSync(memoryDir, { recursive: true });
  const patch = execSync(`git show ${commit}`).toString();
  fs.writeFileSync(path.join(memoryDir, 'changes.patch'), patch, 'utf8');
  const fragmentsDir = path.join(memoryDir, 'fragments');
  fs.mkdirSync(fragmentsDir, { recursive: true });
  const files = execSync(`git diff-tree --no-commit-id --name-only -r ${commit}`)
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);
  const nodeVersion = process.version;
  let pnpmVersion = 'unknown';
  try {
    pnpmVersion = execSync('pnpm --version').toString().trim();
  } catch (err) {
    console.warn('pnpm not found');
  }
  for (const file of files) {
    const fileDir = path.join(fragmentsDir, path.dirname(file));
    fs.mkdirSync(fileDir, { recursive: true });
    const fragmentPatch = execSync(`git diff ${commit}^ ${commit} -- ${file}`).toString();
    fs.writeFileSync(path.join(fragmentsDir, `${file}.patch`), fragmentPatch, 'utf8');
  }
  const message = execSync(`git log -1 --pretty=%B ${commit}`)
    .toString()
    .trim();
  const meta = {
    commit,
    message,
    patch: 'changes.patch',
    fragments: 'fragments',
    files,
    environment: { node: nodeVersion, pnpm: pnpmVersion },
    instructions: 'Apply patch with git apply or review for reference.'
  };
  fs.writeFileSync(
    path.join(memoryDir, 'meta.yaml'),
    YAML.stringify(meta),
    'utf8'
  );
  console.log(`Commit memory stored in ${memoryDir}`);
}

if (require.main === module) run();
module.exports = { run };
