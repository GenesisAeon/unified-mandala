import { EventEmitter } from 'events';
import { performance } from 'perf_hooks';

describe('Event bus load tests', () => {
  it('processes many events quickly', () => {
    const bus = new EventEmitter();
    const total = 10000;
    let count = 0;
    bus.on('evt', () => { count++; });
    const start = performance.now();
    for (let i = 0; i < total; i++) {
      bus.emit('evt');
    }
    const duration = performance.now() - start;
    expect(count).toBe(total);
    // Log duration for informational benchmarking
    console.log(`Processed ${total} events in ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(5000);
  });
});
