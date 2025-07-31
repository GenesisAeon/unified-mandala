const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;

test('script appends docs', () => {
  const tmp = path.join(__dirname, '..', '__tmp.md');
  fs.writeFileSync(tmp, '# Test');
  fs.copyFileSync(path.join(__dirname, '..', '..', 'Handbuch.md'), tmp);
  exec('node scripts/refresh-handbook.js');
  expect(fs.readFileSync('Handbuch.md', 'utf8')).toMatch(/Handbuch aktualisiert|/);
  fs.unlinkSync(tmp);
});
