import type { HorizonState, MembraneReading } from './index.js';

export type RealMembraneConfig = {
  N?: number;
  T_ok?: number;
  T_warn?: number;
  H?: number;
  K?: number;
  sigmaMin?: number;
};

const DEFAULT_CONFIG: Required<RealMembraneConfig> = {
  N: 200,
  T_ok: 1.0,
  T_warn: 2.0,
  H: 0.2,
  K: 3,
  sigmaMin: 1e-3,
};

type PendingState = { target: HorizonState | null; count: number };

export class RealMembrane {
  private readonly cfg: Required<RealMembraneConfig>;
  private readonly window: number[] = [];
  private sum = 0;
  private sumSq = 0;
  private lastA = 0;
  private state: HorizonState = 'subcritical';
  private pending: PendingState = { target: null, count: 0 };

  constructor(config: RealMembraneConfig = {}) {
    this.cfg = { ...DEFAULT_CONFIG, ...config };
  }

  step(t: number, value: number): MembraneReading {
    this.push(value);
    const len = this.window.length;
    const mean = this.sum / len;
    const variance = len > 1 ? (this.sumSq - len * mean * mean) / (len - 1) : 0;
    const sigma = Math.max(Math.sqrt(Math.max(variance, 0)), this.cfg.sigmaMin);

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
    if (A >= this.cfg.T_warn + this.cfg.H) {
      return 'event';
    }
    if (A >= this.cfg.T_ok - this.cfg.H || dA > 0.5) {
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

export { RealMembrane as NullMembrane };
