import { EventEmitter } from 'events';

export class GreekMathAeonDispatcher {
  readonly emitter = new EventEmitter();

  dispatch(fn: () => void) {
    try {
      fn();
    } catch (err) {
      this.emitter.emit('dispatcher:error', err);
    }
  }

  dispatchWithResult<T>(fn: () => T): T | null {
    try {
      return fn();
    } catch (err) {
      this.emitter.emit('dispatcher:error', err);
      return null;
    }
  }
}
