import { readFileSync } from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import path from 'path';

const ajv = addFormats(new Ajv());
const schema = JSON.parse(readFileSync(path.join(__dirname, 'schemas/sigillin.schema.json'), 'utf8'));
const validate = ajv.compile(schema);

export function validateSigillin(filePath: string): boolean {
  const data = JSON.parse(readFileSync(filePath, 'utf8'));
  const valid = validate(data);
  if (!valid) console.error(validate.errors);
  return Boolean(valid);
}

if (require.main === module) {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: sigillin-validator <file>');
    process.exit(1);
  }
  if (validateSigillin(target)) {
    console.log('Valid sigillin');
  } else {
    process.exit(1);
  }
}
