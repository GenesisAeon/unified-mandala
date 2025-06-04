export interface Sigillin {
  schema_version: string;
  id: string;
  type: 'fallback-anchor' | 'poetic-root' | 'crep-trigger' | 'session-memory' | 'ethik-node';
  status: 'draft' | 'reviewed' | 'published';
  creator: string;
  created_at: string;
  related_sigils?: Array<{ id: string; relation: string }>;
  changes?: string[];
}
