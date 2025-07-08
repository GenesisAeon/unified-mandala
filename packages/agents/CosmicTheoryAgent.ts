import axios from 'axios';
import { fractalDecompose, computeFractalMetric } from '../analysis/FractalAnalyzer';
import { symbolicRegression } from '../analysis/SymbolicRegression';
import { SigilManager } from '../shared-utils/SigilManager';
import { CosmicTheoryEventHub } from './CosmicTheoryAgentEvents';

export const sigilManager = new SigilManager();

export function loadSigil(id: string, text: string): void {
  const entry = sigilManager.loadFromString(id, text);
  CosmicTheoryEventHub.emit('sigil:generated', {
    sigilId: entry.id,
    formula: JSON.stringify(entry.data)
  });
}

export interface AgentWeights {
  coherence: number;
  resonance: number;
  emergence: number;
}

export function adjustWeights(
  weights: AgentWeights,
  metrics: AgentWeights,
  reward: number,
  lr = 0.1
): AgentWeights {
  const updated: AgentWeights = {
    coherence: clamp(weights.coherence + lr * reward * metrics.coherence, 0, 1),
    resonance: clamp(weights.resonance + lr * reward * metrics.resonance, 0, 1),
    emergence: clamp(weights.emergence + lr * reward * metrics.emergence, 0, 1)
  };
  return updated;
}

export function mutateWeights(
  weights: AgentWeights,
  rate = 0.1
): AgentWeights {
  return {
    coherence: clamp(weights.coherence + (Math.random() * 2 - 1) * rate, 0, 1),
    resonance: clamp(weights.resonance + (Math.random() * 2 - 1) * rate, 0, 1),
    emergence: clamp(weights.emergence + (Math.random() * 2 - 1) * rate, 0, 1)
  };
}

export function crossoverWeights(
  a: AgentWeights,
  b: AgentWeights
): AgentWeights {
  return {
    coherence: Math.random() < 0.5 ? a.coherence : b.coherence,
    resonance: Math.random() < 0.5 ? a.resonance : b.resonance,
    emergence: Math.random() < 0.5 ? a.emergence : b.emergence
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export async function fetchCosmicData(url: string): Promise<any> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error('Failed to fetch cosmic data', err);
    throw err;
  }
}

export function analyzeCosmicData(values: number[]): string {
  const fragments = values.flatMap(v => fractalDecompose(v));
  const metric = computeFractalMetric(fragments);
  return symbolicRegression([metric]);
}

