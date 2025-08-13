const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const schema = require('./schemas/sigillin.schema.json');

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(schema);

const SigillinGenerator = (id, type, status, creator, schema_version = '1.0.0') => {
  const sigillin = {
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

module.exports = { SigillinGenerator };
