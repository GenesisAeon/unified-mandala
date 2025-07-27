import EventEmitter from 'events';

export const cosmicBridge = new EventEmitter();

export function emitEvent(event: string, payload: unknown) {
  cosmicBridge.emit(event, payload);
}
