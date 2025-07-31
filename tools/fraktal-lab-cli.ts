#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface PluginModule {
  initialize?: (ctx: any) => any | Promise<any>;
  run?: () => any | Promise<any>;
}

async function loadPlugins(manifestPath: string) {
  const raw = fs.readFileSync(manifestPath, 'utf8');
  const { plugins } = yaml.load(raw) as any;
  await Promise.all(
    (plugins || []).map(async (p: any) => {
      const modPath = path.resolve(path.dirname(manifestPath), p.component);
      const mod: PluginModule = require(modPath);
      if (mod.initialize) {
        await mod.initialize({ logger: console.log });
      } else if (mod.run) {
        await mod.run();
      }
    })
  );
}

async function main() {
  const manifest = process.argv[2] || path.join(__dirname, '../plugins/manifest.yaml');
  await loadPlugins(manifest);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
