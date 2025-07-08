import fs from 'fs';
import path from 'path';

test('protodeploy docker-compose exists', () => {
  const file = path.join(__dirname, '../../infrastructure/protodeploy/docker-compose.yml');
  expect(fs.existsSync(file)).toBe(true);
});
