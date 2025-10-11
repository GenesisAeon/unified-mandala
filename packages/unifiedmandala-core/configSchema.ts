import Ajv, { JSONSchemaType } from 'ajv';

export interface UnifiedMandalaConfig {
  name: string;
  version: string;
  layers?: number;
  enableAudio?: boolean;
}

const schema: JSONSchemaType<UnifiedMandalaConfig> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    version: { type: 'string' },
    layers: { type: 'integer', nullable: true },
    enableAudio: { type: 'boolean', nullable: true },
  },
  required: ['name', 'version'],
  additionalProperties: false,
};

export function validateConfig(raw: unknown): UnifiedMandalaConfig {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  if (!validate(raw)) {
    throw new Error('Invalid config: ' + ajv.errorsText(validate.errors));
  }
  return raw as UnifiedMandalaConfig;
}
