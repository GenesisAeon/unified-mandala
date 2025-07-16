import fs from 'fs';
const { bumpVersion } = require('./sigillin-cli');

test('bump increases patch version', () => {
  const file = 'test.sigil.json';
  fs.writeFileSync(file, JSON.stringify({ id: 't', version: '1.0.0' }, null, 2));
  bumpVersion(file);
  const res = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(res.version).toBe('1.0.1');
  fs.unlinkSync(file);
});
