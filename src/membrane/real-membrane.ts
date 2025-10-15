import { trace } from '@opentelemetry/api';
import type { HorizonState, MembraneReading } from './index.js';
import { MEMBRANE_CFG } from './config.js';
import { recordStep } from './metrics.js';

export type LegacyMembraneConfig = {
  N?: number;
  T_ok?: number;
  T_warn?: number;
  H?: number;
  K?: number;
  sigmaMin?: number;
};

export type RealMembraneConfig = Partial<{
  N: number;
  T_OK: number;
  T_WARN: number;
  H: number;
  K: number;
  SIGMA_MIN: number;
}> &
  LegacyMembraneConfig;

type NormalizedConfig = Required<{
  N: number;
  T_OK: number;
  T_WARN: number;
  H: number;
  K: number;
  SIGMA_MIN: number;
}>;

type PendingState = { target: HorizonState | null; count: number };

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const normalizeConfig = (config: RealMembraneConfig = {}): NormalizedConfig => {
  const base: NormalizedConfig = {
    N: MEMBRANE_CFG.N,
    T_OK: MEMBRANE_CFG.T_OK,
    T_WARN: MEMBRANE_CFG.T_WARN,
    H: MEMBRANE_CFG.H,
    K: MEMBRANE_CFG.K,
    SIGMA_MIN: MEMBRANE_CFG.SIGMA_MIN,
  };
  const maybeN = toNumber(config.N);
  if (maybeN !== undefined) base.N = Math.max(1, Math.round(maybeN));
  const tOk = toNumber((config as LegacyMembraneConfig).T_ok ?? config.T_OK);
  if (tOk !== undefined) base.T_OK = tOk;
  const tWarn = toNumber((config as LegacyMembraneConfig).T_warn ?? config.T_WARN);
  if (tWarn !== undefined) base.T_WARN = tWarn;
  const h = toNumber(config.H);
  if (h !== undefined) base.H = h;
  const k = toNumber(config.K);
  if (k !== undefined) base.K = Math.max(1, Math.round(k));
  const sigma = toNumber((config as LegacyMembraneConfig).sigmaMin ?? config.SIGMA_MIN);
  if (sigma !== undefined) base.SIGMA_MIN = Math.max(1e-9, sigma);
  return base;
};

const now = () =>
  typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();

const getTracer = () => {
  try {
    return trace.getTracer('membrane');
  } catch {
    return null;
  }
};

export class RealMembrane {
  private readonly cfg: NormalizedConfig;
  private readonly window: number[] = [];
  private sum = 0;
  private sumSq = 0;
  private lastA = 0;
  private state: HorizonState = 'subcritical';
  private pending: PendingState = { target: null, count: 0 };

  constructor(config: RealMembraneConfig = {}) {
    this.cfg = normalizeConfig(config);
  }

  step(t: number, value: number): MembraneReading {
    const start = now();
    const prevState = this.state;
    const reading = this.stepCore(t, value);
    const duration = Math.max(0, now() - start);
    recordStep(prevState, reading.state, duration);
    const tracer = getTracer();
    if (tracer) {
      const span = tracer.startSpan('membrane.step', {
        attributes: {
          'membrane.state': reading.state,
          'membrane.A': reading.A,
          'membrane.dA': reading.dA,
        },
      });
      span.end();
    }
    return reading;
  }

  private stepCore(t: number, value: number): MembraneReading {
    this.push(value);
    const len = this.window.length;
    const mean = this.sum / len;
    const variance = len > 1 ? (this.sumSq - len * mean * mean) / (len - 1) : 0;
    const sigma = Math.max(Math.sqrt(Math.max(variance, 0)), this.cfg.SIGMA_MIN);

    const z = (value - mean) / sigma;
    const A = Math.abs(z);
    const dA = A - this.lastA;

    const candidate = this.resolveCandidate(A, dA);
    this.applyState(candidate);
    this.lastA = A;

    const severity = this.state === 'event' ? 'alarm' : this.state === 'apparent' ? 'warn' : 'ok';

    return { t, value, A, dA, state: this.state, severity };
  }

  private push(value: number) {
    this.window.push(value);
    this.sum += value;
    this.sumSq += value * value;
    if (this.window.length > this.cfg.N) {
      const dropped = this.window.shift()!;
      this.sum -= dropped;
      this.sumSq -= dropped * dropped;
    }
  }

  private resolveCandidate(A: number, dA: number): HorizonState {
    if (A >= this.cfg.T_WARN + this.cfg.H) {
      return 'event';
    }
    if (A >= this.cfg.T_OK - this.cfg.H || dA > 0.5) {
      return 'apparent';
    }
    return 'subcritical';
  }

  private applyState(candidate: HorizonState) {
    if (candidate === this.state) {
      this.pending = { target: null, count: 0 };
      return;
    }
    if (this.pending.target === candidate) {
      this.pending.count += 1;
      if (this.pending.count >= this.cfg.K) {
        this.state = candidate;
        this.pending = { target: null, count: 0 };
      }
      return;
    }
    this.pending = { target: candidate, count: 1 };
    if (this.cfg.K <= 1) {
      this.state = candidate;
      this.pending = { target: null, count: 0 };
    }
  }
}
