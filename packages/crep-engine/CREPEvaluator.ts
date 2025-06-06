import { CREPManager } from './CREPManager';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

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

export function getCREPState(crep: { C: number; R: number; E: number }) {
  if (crep.C < 4 || crep.R < 4 || crep.E < 4) return 'critical';
  if (crep.C >= 7 && crep.R >= 7 && crep.E >= 7) return 'safe';
  return 'warning';
}
