import fs from 'fs';
import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import YAML from 'yaml';

export interface ValidationResult {
  valid: boolean;
  errors?: ErrorObject[] | null;
}

export function loadSchema(schemaPath: string): any {
  return JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
}

export function extendSchemaWithMetadata(schema: any): any {
  if (!schema.properties) schema.properties = {};
  if (!schema.properties.metadata) {
    schema.properties.metadata = { type: 'object', additionalProperties: true };
  }
  if (!schema.properties.consent) {
    schema.properties.consent = { type: 'string' };
  }
  return schema;
}

export function validateWithSchema(data: any, schema: any): ValidationResult {
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(data) as boolean;
  return { valid, errors: validate.errors };
}

export function validateFile(file: string, schemaPath: string): ValidationResult {
  const schema = extendSchemaWithMetadata(loadSchema(schemaPath));
  const content = fs.readFileSync(file, 'utf8');
  const data = file.endsWith('.yaml') || file.endsWith('.yml') ? YAML.parse(content) : JSON.parse(content);
  return validateWithSchema(data, schema);
}
