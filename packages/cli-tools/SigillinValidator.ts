import fs from 'fs';
import Ajv from 'ajv';
import YAML from 'yaml';
import path from 'path';
import schema from '../genesis-sigillin-core/schemas/sigillin.schema.json';

export function validateSigil(filePath: string): boolean {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const content = fs.readFileSync(filePath, 'utf8');
  const data = filePath.endsWith('.yaml') || filePath.endsWith('.yml')
    ? YAML.parse(content)
    : JSON.parse(content);
  const valid = validate(data);
  if (!valid) {
    console.error(validate.errors);
  }
  return !!valid;
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: ts-node SigillinValidator.ts <file>');
    process.exit(1);
  }
  const abs = path.resolve(file);
  if (validateSigil(abs)) {
    console.log('Sigillin-Datei gültig.');
  } else {
    process.exit(1);
  }
}
