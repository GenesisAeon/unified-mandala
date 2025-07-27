import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { exportPantheonArchive } from './PantheonArchiveExporter';

describe('PantheonArchiveExporter', () => {
  const outJson = path.join(__dirname, 'archive.json');
  const outYaml = path.join(__dirname, 'archive.yaml');
  const outGraph = path.join(__dirname, 'archiveGraph.json');

  afterEach(() => {
    [outJson, outYaml, outGraph].forEach(f => { if (fs.existsSync(f)) fs.unlinkSync(f); });
  });

  it('exports JSON by default', () => {
    exportPantheonArchive(outJson);
    const obj = JSON.parse(fs.readFileSync(outJson, 'utf-8'));
    expect(Array.isArray(obj.modules)).toBe(true);
  });

  it('exports YAML', () => {
    exportPantheonArchive(outYaml, 'yaml');
    const text = fs.readFileSync(outYaml, 'utf-8');
    expect(text).toContain('modules');
  });

  it('exports graph', () => {
    exportPantheonArchive(outGraph, 'graph');
    const obj = JSON.parse(fs.readFileSync(outGraph, 'utf-8'));
    expect(Array.isArray(obj.nodes)).toBe(true);
  });
});
