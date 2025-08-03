const fs = require('fs');
const path = require('path');
const { run } = require('../update-kontext');

test('updates kontext from conversations file', () => {
  const convPath = path.join(__dirname, 'tmp-conv.json');
  const outPath = path.join(__dirname, 'tmp-kontext.json');
  const conversations = [
    { title: 'Codex Resonanz' },
    { title: 'Sigillin Analyse' }
  ];
  fs.writeFileSync(convPath, JSON.stringify(conversations));
  run(convPath, outPath);
  const result = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  expect(result.topics.codex).toContain('Codex Resonanz');
  expect(result.topics.sigillin).toContain('Sigillin Analyse');
  fs.unlinkSync(convPath);
  fs.unlinkSync(outPath);
});
