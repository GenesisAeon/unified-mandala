import { GPTRole } from './gptRoles';

export interface GPTRequest {
  role: GPTRole;
  input: string;
  context?: any;
}

import { getSymbolzeitPhase } from '../shared-utils/symbolzeitModulator';
import { loadSymbolphasen } from '../shared-utils/loadSymbolphasen';
import { isValidRole } from './gptRoles';

export async function sendToGPT(
  request: GPTRequest,
  retries = 2
): Promise<string> {
  if (!isValidRole(request.role)) {
    throw new Error(`Unbekannte GPT-Rolle: ${request.role}`);
  }
  const phaseId = getSymbolzeitPhase();
  const phases = loadSymbolphasen();
  const prefix = phases[phaseId]?.phase ? `[${phases[phaseId].phase}] ` : '';

  const endpoint = process.env.GPT_ENDPOINT || 'http://localhost:3000/gpt';
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
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
    } catch (err) {
      if (attempt === retries) {
        throw new Error(
          `Network request failed after ${retries + 1} attempts: ${(err as Error).message}`
        );
      }
    }
  }
  throw new Error('Unreachable');
}
