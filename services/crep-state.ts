import { getCREPState } from '../packages/crep-engine/CREPEvaluator';
import { CREPEntry } from '../packages/crep-engine/types';

export type CREPStatus = 'safe' | 'warning' | 'critical';

export function latestCREPStatus(history: CREPEntry[]): CREPStatus {
  if (history.length === 0) return 'safe';
  const last = history[history.length - 1];
  return getCREPState({ C: last.C, R: last.R, E: last.E });
}
