#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

const analysisDir = path.join(projectRoot, 'analysis', 'cosmic-web');
const outDir = path.join(projectRoot, 'out', 'stac', 'cosmic-web');
fs.mkdirSync(outDir, { recursive: true });

const clustersPath = path.join(analysisDir, 'clusters.geojson');
const metaPath = path.join(analysisDir, 'clusters-meta.json');
const graphPath = path.join(analysisDir, 'policy-graph.json');
const sigillPath = path.join(projectRoot, 'sigils', 'demos', 'cosmic-web.sigill.json');

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Missing dependency for cosmic-web STAC: ${path.relative(projectRoot, filePath)}`,
    );
  }
}

ensureFile(clustersPath);
ensureFile(metaPath);
ensureFile(graphPath);
ensureFile(sigillPath);

const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

const relativise = (target) => path.posix.join(...path.relative(outDir, target).split(path.sep));

const item = {
  type: 'Feature',
  stac_version: '1.0.0',
  id: 'cosmic-web-demo',
  geometry: null,
  bbox: meta.bbox,
  properties: {
    'demo:epochs': meta.epochs,
    'demo:note': meta.note,
  },
  assets: {
    clusters: {
      href: relativise(clustersPath),
      type: 'application/geo+json',
      roles: ['data'],
      title: 'Synthetic tracer points',
    },
    graph: {
      href: relativise(graphPath),
      type: 'application/json',
      roles: ['metadata'],
      title: 'Latent policy/data graph',
    },
    sigillin: {
      href: relativise(sigillPath),
      type: 'application/json',
      roles: ['metadata'],
      title: 'Cosmic-Web Demo Sigillin',
    },
  },
  links: [],
};

const outputPath = path.join(outDir, 'item.json');
fs.writeFileSync(outputPath, JSON.stringify(item, null, 2));
console.log(`[stac] wrote ${path.relative(projectRoot, outputPath)}`);
