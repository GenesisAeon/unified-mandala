import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, strict: false });
const schema = JSON.parse(
  fs.readFileSync(path.join('schemas', 'eventbus.message.schema.json'), 'utf-8'),
);
const validate = ajv.compile(schema);

const fxDir = 'fixtures/events';
const files = fs.readdirSync(fxDir).filter((f) => f.endsWith('.json'));

let failed = 0;
for (const f of files) {
  const p = path.join(fxDir, f);
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  const ok = validate(data);
  if (!ok) {
    failed++;
    console.error('[INVALID]', f, JSON.stringify(validate.errors, null, 2));
  } else {
    console.log('[OK]', f);
  }
}

if (failed) {
  process.exit(1);
}
console.log('All fixtures validate.');
