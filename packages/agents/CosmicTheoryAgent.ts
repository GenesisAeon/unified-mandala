import axios from 'axios';
import { metrics } from '@opentelemetry/api';
import { fractalDecompose, computeFractalMetric } from '../analysis/FractalAnalyzer';
import { symbolicRegression } from '../analysis/SymbolicRegression';
import { SigilManager, SigilEntry } from '../shared-utils/SigilManager';
import { CosmicTheoryEventHub, enterVR, exitVR } from './CosmicTheoryAgentEvents';
import { withCircuit } from '../core/withCircuit';

export const sigilManager = new SigilManager();

export const sigilHistory: SigilEntry[] = [];

const meter = metrics.getMeter('cosmic-theory-agent');
const regressionDuration = meter.createHistogram('pysr_call_duration_seconds', {
  description: 'Duration of PySR service calls'
});

const regressionCache = new Map<string, string>();

sigilManager.on('sigil:added', (entry: SigilEntry) => {
  sigilHistory.push(entry);
  CosmicTheoryEventHub.emit('sigil:added', { sigilId: entry.id });
});

sigilManager.on('sigil:updated', (entry: SigilEntry) => {
  CosmicTheoryEventHub.emit('sigil:updated', { sigilId: entry.id });
});

sigilManager.on('sigil:removed', (id: string) => {
  CosmicTheoryEventHub.emit('sigil:removed', { sigilId: id });
});

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

export async function performRemoteAnalysis(
  data: number[],
  endpoint: string,
  protocol: 'rest' | 'grpc' = 'rest'
): Promise<number[]> {
  if (protocol === 'grpc') {
    const { Client, credentials } = await import('@grpc/grpc-js');
    const client = new Client(endpoint, credentials.createInsecure());
    return new Promise((resolve, reject) => {
      client.makeUnaryRequest(
        '/AnalysisService/Analyze',
        arg => Buffer.from(JSON.stringify(arg)),
        buffer => JSON.parse(buffer.toString()),
        { data },
        (err, resp: any) => {
          client.close();
          if (err) return reject(err);
          resolve(resp?.result ?? []);
        }
      );
    });
  }
  const resp = await axios.post(endpoint, { data });
  return resp.data.result;
}

export async function callPySRService(
  data: number[],
  endpoint: string,
  protocol: 'rest' | 'grpc' = 'rest'
): Promise<string> {
  CosmicTheoryEventHub.emit('theory:start', { dataPoints: data });
  const cacheKey = `${endpoint}:${protocol}:${JSON.stringify(data)}`;
  if (regressionCache.has(cacheKey)) {
    return regressionCache.get(cacheKey)!;
  }

  const run = async (): Promise<string> => {
    if (protocol === 'grpc') {
      const { Client, credentials } = await import('@grpc/grpc-js');
      const client = new Client(endpoint, credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.makeUnaryRequest(
          '/PySRService/Regress',
          arg => Buffer.from(JSON.stringify(arg)),
          buffer => JSON.parse(buffer.toString()),
          { data },
          (err, resp: any) => {
            client.close();
            if (err) return reject(err);
            const eq = resp?.equation ?? '';
            CosmicTheoryEventHub.emit('theory:regression:success', { equation: eq });
            resolve(eq);
          }
        );
      });
    }
    const resp = await axios.post(endpoint, { data });
    CosmicTheoryEventHub.emit('theory:regression:success', { equation: resp.data.equation });
    return resp.data.equation;
  };

  const wrapped = withCircuit(run, { timeout: 5000 });
  const start = Date.now();
  const equation = await wrapped();
  regressionDuration.record((Date.now() - start) / 1000);
  regressionCache.set(cacheKey, equation);
  return equation;
}

export { enterVR, exitVR };

