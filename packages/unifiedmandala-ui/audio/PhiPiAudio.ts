export const PHI = (1 + Math.sqrt(5)) / 2;
export const PI = Math.PI;

export interface Tone {
  frequency: number;
  duration: number;
}

export class PhiPiAudio {
  private ctx: AudioContext | null = null;
  constructor(private baseFreq = 440) {
    if (typeof AudioContext !== 'undefined') {
      this.ctx = new AudioContext();
    }
  }

  private play(frequency: number, duration = 0.5) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.frequency.value = frequency;
    osc.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playPhi(duration = 0.5) {
    this.play(this.baseFreq * PHI, duration);
  }

  playPi(duration = 0.5) {
    this.play(this.baseFreq * PI, duration);
  }
}

export function getPhiTone(base = 440): Tone {
  return { frequency: base * PHI, duration: 0.5 };
}

export function getPiTone(base = 440): Tone {
  return { frequency: base * PI, duration: 0.5 };
}
