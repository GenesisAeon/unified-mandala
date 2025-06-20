import fs from 'fs';
import yaml from 'js-yaml';

test('meta learner workflow exists', () => {
  const doc = yaml.load(fs.readFileSync('.github/workflows/meta-learner.yml', 'utf8')) as any;
  expect(doc.name).toBe('Meta Learner');
});
