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
}
