import { CREPManager } from './CREPManager';
import { GPTEventHub } from '../../gpt-bridges/GPTEventHub';

const emergenceThreshold = parseFloat(process.env.CREP_THRESHOLD_EMERGENCE || '0.8');
const persistenceThreshold = parseFloat(process.env.CREP_THRESHOLD_PERSISTENCE || '0.3');

export class CREPEvaluator {
  constructor(private manager: CREPManager) {}

  evaluateNewDataPoint(data: { C: number; R: number; E: number; P: number }) {
    if (data.E > emergenceThreshold && data.P < persistenceThreshold) {
      GPTEventHub.emit('emergence:detected', data);
    }
    this.manager.addCREPEntry(data.C, data.R, data.E, data.P);
  }
}
