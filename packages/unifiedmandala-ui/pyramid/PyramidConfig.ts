import Ajv from 'ajv';

export interface PyramidLayer {
  name: string;
  weight: number;
  color?: string;
}

export interface PyramidConfig {
  layers: PyramidLayer[];
  /** total number of layers in the pyramid */
  totalLayers?: number;
  /** number of nodes per layer */
  nodesPerLayer?: number;
  /** weight factors used for CREP based computations */
  weightFactors?: {
    coherence: number;
    resonance: number;
    emergence: number;
    poetics: number;
  };
}

const schema = {
  type: 'object',
  properties: {
    layers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          weight: { type: 'number' },
          color: { type: 'string', nullable: true },
        },
        required: ['name', 'weight'],
        additionalProperties: false,
      },
    },
    totalLayers: { type: 'number' },
    nodesPerLayer: { type: 'number' },
    weightFactors: {
      type: 'object',
      properties: {
        coherence: { type: 'number' },
        resonance: { type: 'number' },
        emergence: { type: 'number' },
        poetics: { type: 'number' },
      },
      required: ['coherence', 'resonance', 'emergence', 'poetics'],
      additionalProperties: false,
    },
  },
  required: ['layers'],
  additionalProperties: false,
};

export function loadPyramidConfig(raw: unknown): PyramidConfig {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  if (!validate(raw)) {
    throw new Error('Invalid PyramidConfig: ' + ajv.errorsText(validate.errors));
  }
  return raw as unknown as PyramidConfig;
}
