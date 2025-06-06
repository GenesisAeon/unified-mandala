import { GPTRole } from './gptRoles';

export interface GPTRequest {
  role: GPTRole;
  input: string;
  context?: any;
}

import { getSymbolzeitPhase } from '../shared-utils/symbolzeitModulator';
import { loadSymbolphasen } from '../shared-utils/loadSymbolphasen';
import { isValidRole } from './gptRoles';

export function sendToGPT(request: GPTRequest) {
  if (!isValidRole(request.role)) {
    throw new Error(`Unbekannte GPT-Rolle: ${request.role}`);
  }
  const phaseId = getSymbolzeitPhase();
  const phases = loadSymbolphasen();
  const prefix = phases[phaseId]?.phase ? `[${phases[phaseId].phase}] ` : '';
  console.log('Stub für GPT-Verbindung:', request, 'Phase:', phaseId);
  return `${prefix}Dies ist ein GPT-Stubsignal.`;
}
