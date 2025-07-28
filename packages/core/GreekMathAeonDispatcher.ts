export class GreekMathAeonDispatcher {
  dispatch(fn: () => void) {
    try {
      fn();
    } catch (err) {
      if (typeof process !== 'undefined') {
        process.emit('dispatcher:error', err);
      }
    }
  }

  dispatchWithResult<T>(fn: () => T): T | null {
    try {
      return fn();
    } catch (err) {
      if (typeof process !== 'undefined') {
        process.emit('dispatcher:error', err);
      }
      return null;
    }
  }
}
