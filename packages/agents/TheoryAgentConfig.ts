import Ajv from 'ajv';

export interface TheoryAgentConfig {
  name: string;
  version: string;
  description?: string;
  weights: {
    theory: number;
    practice: number;
  };
}

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    version: { type: 'string' },
    description: { type: 'string', nullable: true },
    weights: {
      type: 'object',
      properties: {
        theory: { type: 'number' },
        practice: { type: 'number' }
      },
      required: ['theory', 'practice'],
      additionalProperties: false
    }
  },
  required: ['name', 'version', 'weights'],
  additionalProperties: false
};

export function loadTheoryAgentConfig(raw: unknown): TheoryAgentConfig {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  if (!validate(raw)) {
    throw new Error('Invalid TheoryAgentConfig: ' + ajv.errorsText(validate.errors));
  }
  return raw as TheoryAgentConfig;
}
