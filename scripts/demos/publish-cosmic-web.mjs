#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

const sourceDir = path.join(projectRoot, 'analysis', 'cosmic-web');
const targetDir = path.join(projectRoot, 'apps', 'ui', 'public', 'demo', 'cosmic-web');

const requiredFiles = ['clusters.geojson', 'clusters-meta.json', 'policy-graph.json'];

for (const file of requiredFiles) {
  const absolute = path.join(sourceDir, file);
  if (!fs.existsSync(absolute)) {
    throw new Error(
      `Missing artefact ${path.relative(projectRoot, absolute)} – run pnpm demo:cosmic:generate first.`,
    );
  }
}

fs.mkdirSync(targetDir, { recursive: true });
for (const file of requiredFiles) {
  const absolute = path.join(sourceDir, file);
  const destination = path.join(targetDir, file);
  fs.copyFileSync(absolute, destination);
}

console.log(`[publish] cosmic-web artefacts copied to ${path.relative(projectRoot, targetDir)}`);
