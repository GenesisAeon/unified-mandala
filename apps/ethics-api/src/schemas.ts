export const EthicsCheckSchema = {
  type: 'object',
  required: ['content'],
  additionalProperties: false,
  properties: {
    intent: { type: 'string' },
    content: {
      anyOf: [
        { type: 'string' },
        { type: 'object' },
        { type: 'array' },
      ],
    },
    context: {
      type: 'object',
      additionalProperties: true,
    },
    evidence: {
      type: 'array',
      items: { type: 'string' },
    },
    flags: {
      type: 'object',
      additionalProperties: true,
    },
  },
} as const;

export type EthicsCheckInput = {
  intent?: string;
  content: unknown;
  context?: Record<string, unknown>;
  evidence?: string[];
  flags?: Record<string, unknown>;
};
