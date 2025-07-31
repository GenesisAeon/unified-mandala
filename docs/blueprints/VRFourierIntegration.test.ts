import fs from 'fs';
import path from 'path';

test('blueprint mentions FourierLayer', () => {
  const text = fs.readFileSync(path.join(__dirname, 'VRFourierIntegration.md'), 'utf8');
  expect(text).toMatch(/FourierLayer/);
});
