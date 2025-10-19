import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve('.');
const srcDir = resolve(root, 'apps/ethics-api/opa');
const outDir = resolve(root, 'dist/opa');
mkdirSync(outDir, { recursive: true });

const bundlePath = resolve(outDir, 'mandala-ethics-bundle.tar.gz');
const tar = process.platform === 'win32' ? 'tar.exe' : 'tar';
const result = spawnSync(tar, ['-czf', bundlePath, '-C', srcDir, 'policy.rego', 'manifest.json'], {
  stdio: 'inherit',
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const hint = {
  bundle: bundlePath,
  query: 'data.mandala.ethics.output',
};
writeFileSync(resolve(outDir, 'README.json'), `${JSON.stringify(hint, null, 2)}\n`);
console.log(`[opa:bundle] created ${bundlePath}`);
