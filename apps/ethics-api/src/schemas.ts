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
    net: {
      type: 'object',
      additionalProperties: false,
      properties: {
        hostname_ascii: { type: 'string' },
        resolved_ip: { type: 'string' },
        cname_chain: {
          type: 'array',
          items: { type: 'string' },
        },
        min_ttl_sec: { type: 'number', minimum: 0 },
        is_private: { type: 'boolean' },
      },
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
  net?: {
    hostname_ascii?: string;
    resolved_ip?: string;
    cname_chain?: string[];
    min_ttl_sec?: number;
    is_private?: boolean;
  };
  evidence?: string[];
  flags?: Record<string, unknown>;
};
