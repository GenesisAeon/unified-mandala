import fs from 'fs';
import yaml from 'js-yaml';

test('CI config includes OTel Collector step', () => {
  const config = yaml.load(fs.readFileSync('.github/workflows/ci.yml', 'utf8')) as any;
  const steps = config.jobs.build.steps.map((s: any) => s.name || s.run || '');
  expect(steps).toContain('Start OTel Collector');
});
