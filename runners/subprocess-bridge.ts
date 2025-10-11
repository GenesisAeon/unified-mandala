import { fork } from 'child_process';
import path from 'path';
import fs from 'fs';
import { generateHTMLReport } from './report.js';

function runChild(script: string, env: Record<string, string>): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = fork(script, [], { env: { ...process.env, ...env }, stdio: 'inherit' as any });
    p.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`)),
    );
    p.on('error', reject);
  });
}

async function main() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.join(process.cwd(), 'runs', ts);
  const artifacts = path.join(outDir, 'artifacts');
  fs.mkdirSync(artifacts, { recursive: true });

  const env = { OUT_DIR: path.join(process.cwd(), 'runs'), RUN_ID: ts };

  await runChild(path.join(process.cwd(), 'processes', 'universe-tree.js'), env);
  await runChild(path.join(process.cwd(), 'processes', 'seed-models.js'), env);
  await runChild(path.join(process.cwd(), 'processes', 'utopie-adapter.js'), env);

  const tree = JSON.parse(fs.readFileSync(path.join(artifacts, 'tree.json'), 'utf-8'));
  const seed = JSON.parse(fs.readFileSync(path.join(artifacts, 'seed_results.json'), 'utf-8'));
  const utopia = JSON.parse(fs.readFileSync(path.join(artifacts, 'utopia_rows.json'), 'utf-8'));

  await generateHTMLReport(path.join(outDir, 'report.html'), tree, seed, utopia);
  console.log('Done:', outDir);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
