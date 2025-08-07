import { Sigillin } from './types';

const VALID_TYPES: Sigillin['type'][] = [
  'fallback-anchor',
  'poetic-root',
  'crep-trigger',
  'session-memory',
  'ethik-node',
];

const VALID_STATUS: Sigillin['status'][] = ['draft', 'reviewed', 'published'];

export function checkIntegrity(sig: Partial<Sigillin> | null | undefined): boolean {
  if (!sig || typeof sig !== 'object') return false;
  const required: (keyof Sigillin)[] = [
    'schema_version',
    'id',
    'type',
    'status',
    'creator',
    'created_at',
  ];
  for (const field of required) {
    const value = (sig as any)[field];
    if (typeof value !== 'string' || value.trim() === '') {
      return false;
    }
  }
  if (!VALID_TYPES.includes(sig.type as Sigillin['type'])) return false;
  if (!VALID_STATUS.includes(sig.status as Sigillin['status'])) return false;
  return true;
}
