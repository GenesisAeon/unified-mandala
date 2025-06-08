import fs from 'fs';
import path from 'path';
import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
let parseYaml: (str: string) => any;
try {
  parseYaml = require('yaml').parse;
} catch {
  parseYaml = JSON.parse;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ErrorObject[] | null;
}

export function validateSigillin(file: string, schemaPath?: string): ValidationResult {
  const schemaFile = schemaPath || path.join(__dirname, '../genesis-sigillin-core/schemas/sigillin.schema.json');
  const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
  const content = fs.readFileSync(file, 'utf8');
  const data = file.endsWith('.yaml') || file.endsWith('.yml') ? parseYaml(content) : JSON.parse(content);
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(data) as boolean;
  return { valid, errors: validate.errors };
}
