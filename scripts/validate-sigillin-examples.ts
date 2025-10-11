import fs from 'fs';
import path from 'path';
import { validateSigilFile } from '../packages/cli-tools/SigillinValidator';

export function validateSigillinExamples(dir = path.join(__dirname, '../docs/sigillin.examples')) {
  const files = fs
    .readdirSync(dir)
    .filter(
      (f) => f.endsWith('.sigil.json') || f.endsWith('.sigil.yaml') || f.endsWith('.sigil.yml'),
    );
  let ok = true;
  for (const file of files) {
    const full = path.join(dir, file);
    const valid = validateSigilFile(full);
    if (!valid) {
      console.error(`Invalid sigil: ${file}`);
      ok = false;
    } else {
      console.log(`Validated ${file}`);
    }
  }
  if (!ok) {
    process.exit(1);
  }
}

if (require.main === module) {
  validateSigillinExamples();
}
