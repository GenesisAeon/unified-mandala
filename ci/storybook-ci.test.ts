import fs from 'fs';

test('opentelemetry and storybook configs exist', () => {
  expect(fs.existsSync('ci/opentelemetry-config.js')).toBe(true);
  expect(fs.existsSync('ci/storybook-ci.sh')).toBe(true);
});
