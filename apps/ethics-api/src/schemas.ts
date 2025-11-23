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
        ttl_sec: { type: 'number', minimum: 0 },
        redirect_hops: { type: 'number', minimum: 0 },
        tls_san_ok: { type: 'boolean' },
        tls_ip_mismatch: { type: 'boolean' },
        tls_remote_ip: { type: 'string' },
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
    ttl_sec?: number;
    redirect_hops?: number;
    tls_san_ok?: boolean;
    tls_ip_mismatch?: boolean;
    tls_remote_ip?: string;
  };
  evidence?: string[];
  flags?: Record<string, unknown>;
};
