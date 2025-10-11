#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

export function generatePluginManifest(
  outFile = path.join(__dirname, '../plugins/generated-manifest.yaml'),
): void {
  const pluginsDir = path.join(__dirname, '../plugins');
  const entries = fs.readdirSync(pluginsDir).filter((f) => {
    const p = path.join(pluginsDir, f);
    return fs.statSync(p).isDirectory();
  });
  const manifest: { plugins: any[] } = { plugins: [] };
  for (const dir of entries) {
    const mf = path.join(pluginsDir, dir, 'manifest.yaml');
    if (!fs.existsSync(mf)) continue;
    const data = YAML.parse(fs.readFileSync(mf, 'utf8')) as any;
    manifest.plugins.push({
      name: data.name,
      version: data.version,
      entry: path.relative(
        path.dirname(outFile),
        path.join(pluginsDir, dir, data.entry || 'index.js'),
      ),
      description: data.description,
      type: data.type,
    });
  }
  fs.writeFileSync(outFile, YAML.stringify(manifest));
}

if (require.main === module) {
  const [, , out] = process.argv;
  generatePluginManifest(out);
  console.log('Generated', out || 'plugins/generated-manifest.yaml');
}
