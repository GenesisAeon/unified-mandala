import { EventEmitter } from 'events';

export interface CompassionInput {
  type: string;
  intensity: number;
  message?: string;
}

export class AeonCompassionAgent {
  constructor(private bus: EventEmitter) {}

  process(input: CompassionInput, root: { log?: (msg: string) => void }) {
    const status = `${input.type}:${input.intensity}`;
    this.bus.emit('sigil-status', status);
    root.log?.(status);
  }
}
