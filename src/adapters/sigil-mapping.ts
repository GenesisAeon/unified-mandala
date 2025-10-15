import { SigilMessage, nowIso } from '../../packages/sigil/protocols';

export type SigilState = 'subcritical' | 'apparent' | 'event';
export type SigilSeverity = 'ok' | 'warn' | 'alarm';
export type SigilIntent = 'notify' | 'escalate' | 'recover';

export interface SigilMessageContractContext {
  source?: string;
  boundaryLawId?: string;
  notes?: string;
}

export interface SigilMessageContract {
  kind: 'SigilMessage';
  schemaVersion: string;
  ts: string;
  id?: string;
  kpi: string;
  state: SigilState;
  severity: SigilSeverity;
  intent: SigilIntent;
  symbol: string;
  ascii?: boolean;
  asciiSymbol?: string;
  A?: number;
  dA?: number;
  context?: SigilMessageContractContext;
  evidence?: string[];
  meta?: Record<string, unknown>;
}

export interface BuildSigilInput {
  symbol: string;
  kpi: string;
  state: SigilState;
  severity: SigilSeverity;
  intent: SigilIntent;
  ascii?: boolean;
  asciiSymbol?: string;
  schemaVersion?: string;
  ts?: string;
  id?: string;
  A?: number;
  dA?: number;
  context?: SigilMessageContractContext;
  evidence?: string[];
  meta?: Record<string, unknown>;
}

const pickContext = (context: SigilMessageContractContext | undefined) => {
  if (!context) return undefined;
  const payload: SigilMessageContractContext = {};
  if (context.source) payload.source = context.source;
  if (context.boundaryLawId) payload.boundaryLawId = context.boundaryLawId;
  if (context.notes) payload.notes = context.notes.slice(0, 2000);
  return Object.keys(payload).length > 0 ? payload : undefined;
};

const sanitizeEvidence = (evidence: string[] | undefined) => {
  if (!Array.isArray(evidence)) return undefined;
  const filtered = evidence.filter((item) => typeof item === 'string' && item.trim().length > 0);
  return filtered.length > 0 ? filtered : undefined;
};

export function buildSigilMessage(input: BuildSigilInput): SigilMessageContract {
  if (input.ascii === true && !input.asciiSymbol) {
    throw new Error('asciiSymbol is required when ascii is true');
  }
  const schemaVersion = input.schemaVersion ?? '1.0.0';
  const ts = input.ts ?? new Date().toISOString();
  const context = pickContext(input.context);
  const evidence = sanitizeEvidence(input.evidence);
  const result: SigilMessageContract = {
    kind: 'SigilMessage',
    schemaVersion,
    ts,
    kpi: input.kpi,
    state: input.state,
    severity: input.severity,
    intent: input.intent,
    symbol: input.symbol,
  };
  if (input.id) {
    result.id = input.id;
  }
  if (input.ascii !== undefined) {
    result.ascii = input.ascii;
  }
  if (input.asciiSymbol) {
    result.asciiSymbol = input.asciiSymbol;
  }
  if (typeof input.A === 'number') {
    result.A = input.A;
  }
  if (typeof input.dA === 'number') {
    result.dA = input.dA;
  }
  if (context) {
    result.context = context;
  }
  if (evidence) {
    result.evidence = evidence;
  }
  if (input.meta && Object.keys(input.meta).length > 0) {
    result.meta = { ...input.meta };
  }
  return result;
}

export function temperatureToSigil(celsius: number, src = 'era5'): SigilMessage {
  const severe = celsius >= 30 ? 'high' : celsius <= 0 ? 'low' : 'normal';
  const symbol = celsius >= 30 ? '🔥' : celsius <= 0 ? '❄️' : '🌡️';
  return {
    symbol,
    intent: 'assert',
    context: { metric: 't2m', celsius, severity: severe },
    metadata: { source: src, timestamp: nowIso() },
  };
}

export function biodiversityToSigil(speciesCount: number, src = 'biodiv'): SigilMessage {
  const symbol = speciesCount >= 100 ? '🌿' : speciesCount >= 40 ? '🍃' : '🦗';
  return {
    symbol,
    intent: 'assert',
    context: { metric: 'species', count: speciesCount },
    metadata: { source: src, timestamp: nowIso() },
  };
}

export function wildfireToSigil(index01: number, src = 'wildfire'): SigilMessage {
  const clamped = Math.max(0, Math.min(1, index01));
  const symbol = clamped >= 0.7 ? '🔥' : clamped >= 0.4 ? '⚠️' : '🟢';
  return {
    symbol,
    intent: 'assert',
    context: { metric: 'wildfire_risk', index: clamped },
    metadata: { source: src, timestamp: nowIso() },
  };
}

export function groundwaterToSigil(deltaCm: number, src = 'groundwater'): SigilMessage {
  const symbol = deltaCm <= -30 ? '🧯' : deltaCm <= -15 ? '🚰' : '💧';
  return {
    symbol,
    intent: 'assert',
    context: { metric: 'groundwater_delta_cm', delta: deltaCm },
    metadata: { source: src, timestamp: nowIso() },
  };
}
