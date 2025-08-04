import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateSchema<T>(schema: object, data: unknown): { valid: boolean; errors?: string[] } {
  const validate: ValidateFunction<T> = ajv.compile<T>(schema);
  const valid = validate(data) as boolean;
  if (valid) {
    return { valid: true };
  }
  return {
    valid: false,
    errors: validate.errors?.map(e => `${e.instancePath} ${e.message}`)
  };
}
