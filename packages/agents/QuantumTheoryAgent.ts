import { EventEmitter } from 'events';

export interface QubitMeasurement {
  /** Difference between matter and antimatter CPT states */
  cptDelta: number;
  timestamp?: number;
}

export class AntimatterQubitMonitor extends EventEmitter {
  constructor(private readonly threshold = 0.1) {
    super();
  }

  record(measurement: QubitMeasurement) {
    if (Math.abs(measurement.cptDelta) > this.threshold) {
      this.emit('anomaly', measurement);
    }
  }
}

export class QuantumTheoryAgent {
  private readonly monitor: AntimatterQubitMonitor;

  constructor(threshold = 0.1, monitor?: AntimatterQubitMonitor) {
    this.monitor = monitor ?? new AntimatterQubitMonitor(threshold);
  }

  observe(measurement: QubitMeasurement) {
    this.monitor.record(measurement);
  }

  onAnomaly(listener: (m: QubitMeasurement) => void) {
    this.monitor.on('anomaly', listener);
  }
}

export default QuantumTheoryAgent;
