import fs from 'fs';

test('meta learner workflow exists', () => {
  expect(fs.existsSync('.github/workflows/meta-learner-agent.yml')).toBe(true);
});
