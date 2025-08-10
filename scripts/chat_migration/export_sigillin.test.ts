import { describe, it, expect } from 'vitest';
import path from 'path';
import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import { exportSigillin } from './export_sigillin';

describe('exportSigillin', () => {
  it('exports sigils to JSON and YAML files', async () => {
    const memoryPath = path.join(__dirname, '../../tests/fixtures/sample-sigils');
    const outJsonPath = path.join(__dirname, 'tmp-sigils.json');
    const outYamlPath = path.join(__dirname, 'tmp-sigils.yaml');

    await fs.rm(outJsonPath, { force: true });
    await fs.rm(outYamlPath, { force: true });

    const result = await exportSigillin({ memoryPath, outJsonPath, outYamlPath });

    const writtenJson = JSON.parse(await fs.readFile(outJsonPath, 'utf8'));
    const writtenYaml = yaml.load(await fs.readFile(outYamlPath, 'utf8')) as any;

    expect(writtenJson).toEqual(result);
    expect(writtenYaml).toEqual(result);
    expect(result.length).toBe(2);

    await fs.rm(outJsonPath, { force: true });
    await fs.rm(outYamlPath, { force: true });
  });
});
