import { SigilMessage, nowIso } from '../../packages/sigil/protocols';

export interface SigilMessageContract {
  symbol: string;
  intent: 'inform' | 'warn' | 'alarm' | 'celebrate';
  context: string;
  meta: {
    ts: string;
    source: string;
    crep?: {
      coherence?: number;
      resonance?: number;
      emergence?: number;
      poetics?: number;
    };
    [key: string]: unknown;
  };
}

type BuildSigilInput = {
  symbol: string;
  intent: SigilMessageContract['intent'];
  context: string;
  meta: {
    source: string;
    ts?: string;
    crep?: {
      coherence?: number;
      resonance?: number;
      emergence?: number;
      poetics?: number;
    };
    [key: string]: unknown;
  };
};

const clamp01 = (value: number | undefined) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

export function buildSigilMessage(input: BuildSigilInput): SigilMessageContract {
  const { symbol, intent, context } = input;
  const ts = input.meta.ts ?? new Date().toISOString();
  const meta: SigilMessageContract['meta'] = {
    ts,
    source: input.meta.source,
  };
  for (const [key, value] of Object.entries(input.meta)) {
    if (key === 'ts' || key === 'source' || key === 'crep') continue;
    meta[key] = value;
  }
  if (input.meta.crep) {
    const crep: NonNullable<SigilMessageContract['meta']['crep']> = {};
    const coherence = clamp01(input.meta.crep.coherence);
    const resonance = clamp01(input.meta.crep.resonance);
    const emergence = clamp01(input.meta.crep.emergence);
    const poetics = clamp01(input.meta.crep.poetics);
    if (typeof coherence === 'number') crep.coherence = coherence;
    if (typeof resonance === 'number') crep.resonance = resonance;
    if (typeof emergence === 'number') crep.emergence = emergence;
    if (typeof poetics === 'number') crep.poetics = poetics;
    if (Object.keys(crep).length > 0) {
      meta.crep = crep;
    }
  }
  return { symbol, intent, context, meta };
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
