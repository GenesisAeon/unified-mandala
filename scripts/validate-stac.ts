import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'node:fs';

const schema = JSON.parse(fs.readFileSync('src/adapters/_schema/stac-item.schema.json', 'utf8'));

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

const file = process.argv[2];
if (!file) {
  console.error('Usage: pnpm stac:validate:item <file>');
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!validate(data)) {
  console.error('❌ STAC invalid:\n' + ajv.errorsText(validate.errors, { separator: '\n' }));
  process.exit(1);
}
console.log('✅ STAC valid');
