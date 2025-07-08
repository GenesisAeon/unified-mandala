import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { Client } from '@grpc/grpc-js';
import {
  adjustWeights,
  mutateWeights,
  crossoverWeights,
  AgentWeights,
  loadSigil,
  sigilManager,
  performRemoteAnalysis
} from './CosmicTheoryAgent';
import { CosmicTheoryEventHub } from './CosmicTheoryAgentEvents';

vi.mock('axios');

describe('adjustWeights', () => {
  it('increases weights with positive reward', () => {
    const w: AgentWeights = { coherence: 0.5, resonance: 0.5, emergence: 0.5 };
    const metrics: AgentWeights = { coherence: 0.8, resonance: 0.2, emergence: 0.4 };
    const result = adjustWeights(w, metrics, 1, 0.1);
    expect(result.coherence).toBeGreaterThan(w.coherence);
  });

  it('clamps weights between 0 and 1', () => {
    const w: AgentWeights = { coherence: 0.95, resonance: 0.95, emergence: 0.95 };
    const metrics: AgentWeights = { coherence: 1, resonance: 1, emergence: 1 };
    const result = adjustWeights(w, metrics, 1, 1);
    expect(result.coherence).toBeLessThanOrEqual(1);
    expect(result.coherence).toBeGreaterThanOrEqual(0);
  });
});

describe('mutation and crossover', () => {
  it('mutateWeights stays within range', () => {
    const w: AgentWeights = { coherence: 0.5, resonance: 0.5, emergence: 0.5 };
    const mutated = mutateWeights(w, 0.2);
    expect(mutated.coherence).toBeGreaterThanOrEqual(0);
    expect(mutated.coherence).toBeLessThanOrEqual(1);
  });

  it('crossoverWeights picks values from parents', () => {
    const a: AgentWeights = { coherence: 0.1, resonance: 0.2, emergence: 0.3 };
    const b: AgentWeights = { coherence: 0.9, resonance: 0.8, emergence: 0.7 };
    const child = crossoverWeights(a, b);
    expect([a.coherence, b.coherence]).toContain(child.coherence);
    expect([a.resonance, b.resonance]).toContain(child.resonance);
    expect([a.emergence, b.emergence]).toContain(child.emergence);
  });
});

describe('sigil integration', () => {
  it('emits event when loading sigil', () => {
    const events: any[] = [];
    CosmicTheoryEventHub.on('sigil:generated', e => events.push(e));
    loadSigil('alpha', '{"f":1}');
    expect(sigilManager.list()[0].id).toBe('alpha');
    expect(events[0].sigilId).toBe('alpha');
  });
});

describe('performRemoteAnalysis', () => {
  it('calls REST endpoint', async () => {
    vi.spyOn(axios, 'post').mockResolvedValue({ data: { result: [1, 2, 3] } });
    const res = await performRemoteAnalysis([1], 'http://localhost/analyze');
    expect(res).toEqual([1, 2, 3]);
  });

  it('calls gRPC endpoint', async () => {
    const makeUnaryRequest = vi.fn((path, ser, des, arg, cb) => cb(null, { result: [42] }));
    vi.spyOn(Client.prototype, 'makeUnaryRequest').mockImplementation(makeUnaryRequest as any);
    const res = await performRemoteAnalysis([1], 'localhost:50051', 'grpc');
    expect(res).toEqual([42]);
  });
});

describe('callPySRService', () => {
  it('calls PySR REST service', async () => {
    vi.spyOn(axios, 'post').mockResolvedValue({ data: { equation: 'y=x' } });
    const eq = await callPySRService([1,2], 'http://localhost/pysr');
    expect(eq).toBe('y=x');
  });

  it('calls PySR gRPC service', async () => {
    const makeUnaryRequest = vi.fn((path, ser, des, arg, cb) => cb(null, { equation: 'y=x^2' }));
    vi.spyOn(Client.prototype, 'makeUnaryRequest').mockImplementation(makeUnaryRequest as any);
    const eq = await callPySRService([1,2], 'localhost:6000', 'grpc');
    expect(eq).toBe('y=x^2');
  });
});
