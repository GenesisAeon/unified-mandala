export const PHI = (1 + Math.sqrt(5)) / 2;
export interface ToneConfig {
  frequency: number;
  duration: number;
}

export class MandalaAudioEngine {
  private ctx: AudioContext | null;

  constructor(private baseFreq = 440) {
    if (typeof AudioContext !== 'undefined') {
      this.ctx = new AudioContext();
    } else {
      this.ctx = null;
    }
  }

  private playTone({ frequency, duration }: ToneConfig) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.frequency.value = frequency;
    osc.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  phiTone(duration = 0.5) {
    this.playTone({ frequency: this.baseFreq * PHI, duration });
  }

  useCREPTone(crep: number, duration = 0.5) {
    const freq = this.baseFreq * (1 + crep);
    this.playTone({ frequency: freq, duration });
  }
}

export function createMandalaSoundscape(crepValues: number[]): ToneConfig[] {
  return crepValues.map((c, i) => ({ frequency: 220 + c * 100 + i * 10, duration: 0.3 }));
}
