import fs from 'fs';
import path from 'path';

test('prototype deploy script exists', () => {
  const script = path.join(__dirname, '../prototype-deploy.sh');
  expect(fs.existsSync(script)).toBe(true);
});
