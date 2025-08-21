import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateArgs(schema: object, args: unknown): void {
  const validate = ajv.compile(schema);
  if (!validate(args)) {
    const msg = ajv.errorsText(validate.errors, { separator: ', ' });
    throw new Error(`Invalid tool arguments: ${msg}`);
  }
}
