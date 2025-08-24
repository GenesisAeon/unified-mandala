import { validateSigillin, ValidationResult } from '../shared-utils/SigillinValidator';

/**
 * Validate a sigil file against the core schema.
 * @param file - Path to the sigil YAML or JSON file.
 * @param schemaPath - Optional path to a schema file.
 * @returns ValidationResult from Ajv.
 */
export function validateSigilFile(file: string, schemaPath?: string): ValidationResult {
  return validateSigillin(file, schemaPath);
}

if (require.main === module) {
  const [file, schema] = process.argv.slice(2);
  if (!file) {
    console.error('Usage: ts-node SigillinValidator.ts <sigil-file> [schema]');
    process.exit(1);
  }
  const result = validateSigillin(file, schema);
  if (result.valid) {
    console.log('Sigil is valid');
  } else {
    console.error('Sigil is invalid:', result.errors);
    process.exit(1);
  }
}
