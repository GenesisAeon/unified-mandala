import fs from 'fs';

test('package tsconfig exists', () => {
  const exists = fs.existsSync('packages/core/tsconfig.json');
  expect(exists).toBe(true);
});
