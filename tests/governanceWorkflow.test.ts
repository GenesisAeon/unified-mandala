import fs from 'fs';
import yaml from 'yaml';

describe('governance workflow', () => {
  it('includes policy and sigillin steps', () => {
    const content = fs.readFileSync('.github/workflows/governance.yml', 'utf8');
    const data = yaml.parse(content);
    const steps = data.jobs?.governance?.steps?.map((s: any) => s.name);
    expect(steps).toContain('Check AI_POLICY');
    expect(steps).toContain('Sigillin Lint');
  });
});
