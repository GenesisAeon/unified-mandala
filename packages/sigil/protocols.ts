export type SigilIntent = "assert" | "query" | "ritual" | string;

export interface SigilMessage {
  symbol: string;
  intent: SigilIntent;
  context?: Record<string, any>;
  metadata?: { source?: string; timestamp: string };
}

export function nowIso(): string {
  return new Date().toISOString();
}
