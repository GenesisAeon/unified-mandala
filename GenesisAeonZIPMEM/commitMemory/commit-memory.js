const fs = require('fs/promises');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const YAML = require('yaml');

const execAsync = promisify(exec);

async function run() {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const sessionFlag = path.join(repoRoot, '.zipmem_session');
  try {
    await fs.access(sessionFlag);
    console.log('GenesisAeonZIPMEM already initialized for this session.');
    return;
  } catch {
    // session flag absent -> first run
  }
  const { stdout: commitStdout } = await execAsync('git rev-parse HEAD');
  const commit = commitStdout.trim();
  const memoryDir = path.join(
    repoRoot,
    'GenesisAeonZIPMEM',
    'commitMemory',
    commit
  );
  try {
    await fs.access(memoryDir);
    console.log('Memory for this commit already exists.');
    return;
  } catch {
    // directory does not exist
  }
  await fs.mkdir(memoryDir, { recursive: true });
  const { stdout: patchStdout } = await execAsync(
    `git show ${commit} -- . ':(exclude)GenesisAeonZIPMEM'`
  );
  await fs.writeFile(path.join(memoryDir, 'changes.patch'), patchStdout, 'utf8');
  const fragmentsDir = path.join(memoryDir, 'fragments');
  await fs.mkdir(fragmentsDir, { recursive: true });
  const { stdout: filesStdout } = await execAsync(
    `git diff-tree --no-commit-id --name-only -r ${commit}`
  );
  const files = filesStdout
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean)
    .filter((f) => !f.startsWith('GenesisAeonZIPMEM/'));
  const nodeVersion = process.version;
  let pnpmVersion = 'unknown';
  try {
    const { stdout } = await execAsync('pnpm --version');
    pnpmVersion = stdout.trim();
  } catch {
    console.warn('pnpm not found');
  }
  for (const file of files) {
    const fileDir = path.join(fragmentsDir, path.dirname(file));
    await fs.mkdir(fileDir, { recursive: true });
    const { stdout: fragmentPatch } = await execAsync(
      `git diff ${commit}^ ${commit} -- ${file}`
    );
    await fs.writeFile(
      path.join(fragmentsDir, `${file}.patch`),
      fragmentPatch,
      'utf8'
    );
  }
  const { stdout: messageStdout } = await execAsync(
    `git log -1 --pretty=%B ${commit}`
  );
  const message = messageStdout.toString().trim();
  const meta = {
    commit,
    message,
    patch: 'changes.patch',
    fragments: 'fragments',
    files,
    environment: { node: nodeVersion, pnpm: pnpmVersion },
    instructions: 'Apply patch with git apply or review for reference.'
  };
  await fs.writeFile(
    path.join(memoryDir, 'meta.yaml'),
    YAML.stringify(meta),
    'utf8'
  );
  await fs.writeFile(sessionFlag, commit, 'utf8');
  console.log(`Commit memory stored in ${memoryDir}`);
}

if (require.main === module) run();
module.exports = { run };
