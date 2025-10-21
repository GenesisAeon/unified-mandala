import Ajv, { type AnySchema, type JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import * as ipaddr from 'ipaddr.js';

export type EvidenceStrength = 'strong' | 'weak';

export interface EvidenceItem {
  url: string;
  domain: string;
  strength: EvidenceStrength;
}

export interface OpaEvidenceMeta {
  domains_distinct?: number;
  strong_count?: number;
  items?: EvidenceItem[];
}

export interface OpaBoundaryMeta {
  has_violations?: boolean;
  severity_max?: 'low' | 'medium' | 'high';
}

export interface OpaNetworkMeta {
  ttl_sec?: number;
  tls_san_ok?: boolean;
  resolved_ip?: string;
  redirect_hops?: number;
  min_ttl_sec?: number;
  is_private?: boolean;
  tls_ip_mismatch?: boolean;
}

export interface OpaEthicsInput {
  intent?: string;
  content?: string;
  subject?: string;
  degraded?: boolean;
  evidence?: OpaEvidenceMeta;
  boundary?: OpaBoundaryMeta;
  network?: OpaNetworkMeta;
  risk?: { high?: boolean };
  flags?: Record<string, unknown>;
  policy?: {
    min_ttl_sec?: number;
    max_redirect_hops?: number;
  };
}

const evidenceItemSchema: JSONSchemaType<EvidenceItem> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    url: { type: 'string', minLength: 1 },
    domain: { type: 'string', minLength: 1 },
    strength: { type: 'string', enum: ['strong', 'weak'] },
  },
  required: ['url', 'domain', 'strength'],
};

const evidenceSchema: JSONSchemaType<OpaEvidenceMeta> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    domains_distinct: { type: 'integer', minimum: 0, nullable: false } as any,
    strong_count: { type: 'integer', minimum: 0, nullable: false } as any,
    items: { type: 'array', items: evidenceItemSchema, nullable: false } as any,
  },
  required: [],
};

const networkSchema: JSONSchemaType<OpaNetworkMeta> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ttl_sec: { type: 'number', minimum: 0 } as any,
    tls_san_ok: { type: 'boolean' } as any,
    resolved_ip: {
      anyOf: [
        { type: 'string', format: 'ipv4' },
        { type: 'string', format: 'ipv6' },
      ],
    } as any,
    redirect_hops: { type: 'integer', minimum: 0, maximum: 10 } as any,
    min_ttl_sec: { type: 'number', minimum: 0 } as any,
    is_private: { type: 'boolean' } as any,
    tls_ip_mismatch: { type: 'boolean' } as any,
  },
  required: [],
};

const boundarySchema: JSONSchemaType<OpaBoundaryMeta> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    has_violations: { type: 'boolean' } as any,
    severity_max: { type: 'string', enum: ['low', 'medium', 'high'] } as any,
  },
  required: [],
};

const opaEthicsInputSchema: AnySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    intent: { type: 'string', minLength: 1 } as any,
    content: { type: 'string', minLength: 1 } as any,
    subject: { type: 'string', minLength: 1 } as any,
    degraded: { type: 'boolean', default: false } as any,
    evidence: evidenceSchema,
    boundary: boundarySchema,
    network: networkSchema,
    risk: {
      type: 'object',
      additionalProperties: false,
      properties: { high: { type: 'boolean' } as any },
      required: [],
    } as any,
    flags: {
      type: 'object',
      additionalProperties: true,
    } as any,
    policy: {
      type: 'object',
      additionalProperties: false,
      properties: {
        min_ttl_sec: { type: 'number', minimum: 0 } as any,
        max_redirect_hops: { type: 'integer', minimum: 0, maximum: 10 } as any,
      },
      required: [],
    } as any,
  },
  required: [],
  anyOf: [{ required: ['intent'] }, { required: ['content'] }],
};

export class InvalidEthicsInputError extends Error {
  public code = 'INVALID_ETHICS_INPUT' as const;

  public details: string[];

  constructor(message = 'Invalid ethics input', details: string[] = []) {
    super(message);
    this.name = 'InvalidEthicsInputError';
    this.details = details;
  }
}

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: 'all',
  useDefaults: true,
  coerceTypes: true,
});
addFormats(ajv);

const validate = ajv.compile(opaEthicsInputSchema);

function normalizeIp(ip: string): string {
  const parsed = ipaddr.parse(ip) as any;
  if (
    parsed &&
    typeof parsed.kind === 'function' &&
    parsed.kind() === 'ipv6' &&
    typeof parsed.isIPv4MappedAddress === 'function' &&
    parsed.isIPv4MappedAddress()
  ) {
    return parsed.toIPv4Address().toString();
  }
  return typeof parsed?.toString === 'function' ? parsed.toString() : String(ip);
}

export function assertEthicsInput(payload: unknown): asserts payload is OpaEthicsInput {
  if (!validate(payload)) {
    const details = (validate.errors ?? []).map((error) => `${error.instancePath || 'input'} ${error.message ?? ''}`.trim());
    throw new InvalidEthicsInputError('Schema validation failed', details);
  }

  const typed = payload as OpaEthicsInput;

  if (typed.network?.resolved_ip) {
    try {
      typed.network.resolved_ip = normalizeIp(typed.network.resolved_ip);
    } catch {
      throw new InvalidEthicsInputError('Invalid network.resolved_ip', [
        'network.resolved_ip must be a valid IPv4/IPv6 address',
      ]);
    }
  }

  if (typeof typed.network?.ttl_sec === 'number' && !Number.isFinite(typed.network.ttl_sec)) {
    throw new InvalidEthicsInputError('Invalid network.ttl_sec', ['ttl_sec must be finite']);
  }

  if (typeof typed.policy?.min_ttl_sec === 'number' && !Number.isFinite(typed.policy.min_ttl_sec)) {
    throw new InvalidEthicsInputError('Invalid policy.min_ttl_sec', ['min_ttl_sec must be finite']);
  }

  if (typeof typed.policy?.max_redirect_hops === 'number' && !Number.isInteger(typed.policy.max_redirect_hops)) {
    throw new InvalidEthicsInputError('Invalid policy.max_redirect_hops', ['max_redirect_hops must be an integer']);
  }
}

export class MissingNetworkSignalsError extends Error {
  public code = 'MISSING_NETWORK_SIGNALS' as const;

  constructor(message = 'Required network signals missing') {
    super(message);
    this.name = 'MissingNetworkSignalsError';
  }
}

export function assertNetworkSignals(
  input: OpaEthicsInput,
  required: Array<keyof Required<OpaNetworkMeta>> = ['ttl_sec', 'resolved_ip', 'tls_san_ok'],
): asserts input is OpaEthicsInput & { network: Required<OpaNetworkMeta> } {
  const network = input.network ?? {};
  const missing = required.filter((key) => (network as Record<string, unknown>)[key] === undefined);
  if (missing.length > 0) {
    throw new MissingNetworkSignalsError(`Missing fields: ${missing.join(', ')}`);
  }
}
