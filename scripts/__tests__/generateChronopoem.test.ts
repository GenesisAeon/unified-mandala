import fs from 'fs';
import path from 'path';

const scriptPath = path.join(__dirname, '../generate-chronopoem.js');

// Utility to run the script and capture the generated file
function runScript() {
  // Clear Node require cache to ensure script runs
  delete require.cache[require.resolve(scriptPath)];
  require(scriptPath);
}

test('generate-chronopoem writes CHRONOPOEM.md with header', () => {
  const chronopoemPath = path.join(__dirname, '../../CHRONOPOEM.md');
  const original = fs.existsSync(chronopoemPath) ? fs.readFileSync(chronopoemPath, 'utf8') : '';
  runScript();
  const content = fs.readFileSync(chronopoemPath, 'utf8');
  expect(content.startsWith('# 🜂 Chronopoem')).toBe(true);
  fs.writeFileSync(chronopoemPath, original);
});
