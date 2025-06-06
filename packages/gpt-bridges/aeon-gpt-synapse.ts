export interface GPTRequest {
  role: "aeon" | "crep" | "poet";
  input: string;
  context?: any;
}

import { getSymbolzeitPhase } from '../shared-utils/symbolzeitModulator';
import { loadSymbolphasen } from '../shared-utils/loadSymbolphasen';

export function sendToGPT(request: GPTRequest) {
  const phaseId = getSymbolzeitPhase();
  const phases = loadSymbolphasen();
  const prefix = phases[phaseId]?.phase ? `[${phases[phaseId].phase}] ` : '';
  console.log('Stub für GPT-Verbindung:', request, 'Phase:', phaseId);
  return `${prefix}Dies ist ein GPT-Stubsignal.`;
}
