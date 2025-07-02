import fs from 'fs';

test('Dockerfile uses Node 20', () => {
  const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
  expect(dockerfile).toMatch(/node:20-alpine/);
});
