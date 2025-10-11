import fs from 'fs';
import yaml from 'js-yaml';

describe('gpt-5 ethics policy', () => {
  it('enforces strict refusal settings and phrases', () => {
    const raw = fs.readFileSync('plugins/ethics-policy.yaml', 'utf8');
    const policy = yaml.load(raw) as any;
    const model = policy.models['gpt-5'];

    expect(model.refusal_threshold).toBeGreaterThanOrEqual(0.9);
    expect(model.disallowed_phrases).toContain('self-replicating malware');
  });
});
