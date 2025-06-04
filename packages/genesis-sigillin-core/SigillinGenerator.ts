import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from './schemas/sigillin.schema.json';
import { Sigillin } from './types';

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(schema);

export const SigillinGenerator = (
  id: string,
  type: Sigillin['type'],
  status: Sigillin['status'],
  creator: string,
  schema_version = '1.0.0'
): Sigillin => {
  const sigillin: Sigillin = {
    schema_version,
    id,
    type,
    status,
    creator,
    created_at: new Date().toISOString(),
    related_sigils: [],
    changes: [],
  };
  if (!validate(sigillin)) {
    console.error(validate.errors);
    throw new Error('Ungültiges Sigillin');
  }
  return sigillin;
};
