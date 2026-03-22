import type { HorizonState, MembraneReading } from './index';

export type RealMembraneConfig = {
  windowSize?: number;
  thresholdOk?: number;
  thresholdWarn?: number;
  hysteresis?: number;
  debounce?: number;
  sigmaMin?: number;
  warmup?: number;
  /** shorthand alias for windowSize */
  N?: number;
  /** shorthand alias for debounce */
  K?: number;
};

type ResolvedConfig = Required<Omit<RealMembraneConfig, 'N' | 'K'>>;

const DEFAULTS: ResolvedConfig = {
  windowSize: 200,
  thresholdOk: 1.2,
  thresholdWarn: 2.0,
  hysteresis: 0.2,
  debounce: 3,
  sigmaMin: 0.05,
  warmup: 10,
};

export class RealMembrane {
  private readonly cfg: ResolvedConfig;
  private readonly buffer: number[];
  private filled = 0;
  private index = 0;
  private sum = 0;
  private sumSquares = 0;
  private lastA = 0;
  private state: HorizonState = 'subcritical';
  private pending: { target: HorizonState | null; count: number } = { target: null, count: 0 };

  constructor(config: RealMembraneConfig = {}) {
    const { N, K, ...rest } = config;
    this.cfg = {
      ...DEFAULTS,
      ...(N !== undefined ? { windowSize: N } : {}),
      ...(K !== undefined ? { debounce: K } : {}),
      ...rest,
    };
    this.buffer = new Array(this.cfg.windowSize).fill(0);
  }

  step(t: number, value: number): MembraneReading {
    this.insert(value);

    const mean = this.sum / Math.max(this.filled, 1);
    const variance = Math.max(this.sumSquares / Math.max(this.filled, 1) - mean * mean, 0);
    const sigma = Math.max(Math.sqrt(variance), this.cfg.sigmaMin);
    const z = (value - mean) / sigma;
    const A = Math.abs(z);
    const dA = A - this.lastA;

    const candidate = this.deriveState(A, dA);
    this.transition(candidate);

    this.lastA = A;
    const severity = this.state === 'event' ? 'alarm' : this.state === 'apparent' ? 'warn' : 'ok';

    return { t, value, A, dA, state: this.state, severity };
  }

  private insert(value: number) {
    if (this.filled < this.cfg.windowSize) {
      this.buffer[this.index] = value;
      this.sum += value;
      this.sumSquares += value * value;
      this.filled += 1;
    } else {
      const old = this.buffer[this.index];
      this.buffer[this.index] = value;
      this.sum += value - old;
      this.sumSquares += value * value - old * old;
    }
    this.index = (this.index + 1) % this.cfg.windowSize;
  }

  private deriveState(A: number, dA: number): HorizonState {
    if (this.filled < this.cfg.warmup) {
      return 'subcritical';
    }

    const { thresholdOk, thresholdWarn, hysteresis } = this.cfg;

    if (A >= thresholdWarn + hysteresis) {
      return 'event';
    }

    if (A < thresholdOk - hysteresis && dA <= 0.25) {
      return 'subcritical';
    }

    if (dA > 0.5) {
      return 'apparent';
    }

    if (A >= thresholdOk) {
      return 'apparent';
    }

    return this.state;
  }

  private transition(candidate: HorizonState) {
    if (candidate === this.state) {
      this.pending = { target: null, count: 0 };
      return;
    }

    if (this.pending.target === candidate) {
      this.pending.count += 1;
    } else {
      this.pending = { target: candidate, count: 1 };
    }

    if (this.pending.count >= this.cfg.debounce) {
      this.state = candidate;
      this.pending = { target: null, count: 0 };
    }
  }
}
