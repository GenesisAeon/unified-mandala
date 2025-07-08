import EventEmitter from 'events';
import { combinedWeight } from '../analysis/weights';
import { AeonCompassionAgent } from '../agents/AeonCompassionAgent';

export interface MandalaCycleOptions {
  cosmicFactor: number;
}

export class MandalaCycle extends EventEmitter {
  private compassion: AeonCompassionAgent;
  weightFactor = 1;

  constructor(private opts: MandalaCycleOptions, bus = new EventEmitter()) {
    super();
    this.compassion = new AeonCompassionAgent(bus);
  }

  refresh(level = 1) {
    this.weightFactor = combinedWeight(level, this.opts.cosmicFactor);
    this.emit('cycle', { weight: this.weightFactor });
  }

  processInput(input: { type: string; intensity: number }) {
    this.compassion.process(input, { log: () => {} });
  }
}
