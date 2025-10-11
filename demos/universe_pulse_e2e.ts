import { EventEmitter } from 'events';
import { simulatePulse } from '../packages/universum-simulationen/UniversePulseSimulator';

const emitter = new EventEmitter();

// Log each pulse value when emitted
emitter.on('pulse', ({ value, index }) => {
  console.log(`pulse ${index}: ${value.toFixed(3)}`);
});

// Output final run metrics when simulation ends
emitter.on('end', (metrics) => {
  console.log('metrics', metrics);
});

function runSimulation(start: number, steps: number) {
  const values = simulatePulse(start, steps);
  let max = -Infinity;
  let min = Infinity;
  let sum = 0;

  values.forEach((value, index) => {
    emitter.emit('pulse', { value, index });
    sum += value;
    if (value > max) max = value;
    if (value < min) min = value;
  });

  const avg = sum / values.length;
  emitter.emit('end', { avg, max, min });
}

runSimulation(0, 50);
