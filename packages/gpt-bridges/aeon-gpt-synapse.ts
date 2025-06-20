import { GPTRole } from './gptRoles';

export interface GPTRequest {
  role: GPTRole;
  input: string;
  context?: any;
}

import { getSymbolzeitPhase } from '../shared-utils/symbolzeitModulator';
import { loadSymbolphasen } from '../shared-utils/loadSymbolphasen';
import { isValidRole } from './gptRoles';

export async function sendToGPT(request: GPTRequest): Promise<string> {
  if (!isValidRole(request.role)) {
    throw new Error(`Unbekannte GPT-Rolle: ${request.role}`);
  }
  const phaseId = getSymbolzeitPhase();
  const phases = loadSymbolphasen();
  const prefix = phases[phaseId]?.phase ? `[${phases[phaseId].phase}] ` : '';

  const endpoint = process.env.GPT_ENDPOINT || 'http://localhost:3000/gpt';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...request, phase: phaseId })
  });
  if (!response.ok) {
    throw new Error(`GPT request failed: ${response.status}`);
  }
  const data = await response.json();
  const answer = data.response ?? '';
  return `${prefix}${answer}`;
}
