import fs from 'node:fs';
import path from 'node:path';
import { parse as yamlParse } from 'yaml';
import { writeMermaidFile } from './mermaid';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const MAPS_DIR = path.join(ROOT, 'docs', 'maps');
const DIAG_DIR = path.join(ROOT, 'docs', 'diagrams');

function readYaml<T = any>(p: string): T {
  return yamlParse(fs.readFileSync(p, 'utf8')) as T;
}

function writeJson(p: string, data: unknown) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

function tryRenderSVG(mmdPath: string, svgPath: string) {
  const ok = spawnSync('mmdc', ['-i', mmdPath, '-o', svgPath], { stdio: 'inherit' });
  if (ok.status !== 0) {
    console.warn('[maps] mermaid-cli (mmdc) nicht verfügbar – .mmd bleibt als Artefakt bestehen.');
  }
}

function main() {
  fs.mkdirSync(DIAG_DIR, { recursive: true });

  // RepoMap.yaml -> RepoMap.json
  const repoMapYaml = path.join(MAPS_DIR, 'RepoMap.yaml');
  const repoMap = readYaml(repoMapYaml);
  writeJson(path.join(MAPS_DIR, 'RepoMap.json'), repoMap);

  // ProgramFlow.yaml -> ProgramFlow.json + Mermaid
  const pfYaml = path.join(MAPS_DIR, 'ProgramFlow.yaml');
  const pf = readYaml(pfYaml);
  writeJson(path.join(MAPS_DIR, 'ProgramFlow.json'), pf);

  const mmdPath = writeMermaidFile(pf, DIAG_DIR);
  const svgPath = path.join(DIAG_DIR, 'program-flow.svg');
  tryRenderSVG(mmdPath, svgPath);

  console.log('[maps] OK → RepoMap.json, ProgramFlow.json, program-flow.(mmd|svg)');
}

main();
