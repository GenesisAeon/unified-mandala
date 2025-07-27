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
  sigilHistory,
  performRemoteAnalysis,
  callPySRService,
  introspectionLog
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

  it('records history via SigilManager hooks', () => {
    const events: any[] = [];
    CosmicTheoryEventHub.on('sigil:added', e => events.push(e));
    sigilManager.add({ id: 'beta', data: {} });
    sigilManager.update('beta', { x: 1 });
    sigilManager.remove('beta');
    expect(events[0].sigilId).toBe('beta');
    expect(sigilHistory.map(s => s.id)).toContain('beta');
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

  it('emits start and success events', async () => {
    const starts: any[] = [];
    const successes: any[] = [];
    CosmicTheoryEventHub.on('theory:start', p => starts.push(p));
    CosmicTheoryEventHub.on('theory:regression:success', p => successes.push(p));
    vi.spyOn(axios, 'post').mockResolvedValue({ data: { equation: 'y=2x' } });
    const eq = await callPySRService([3,4], 'http://localhost/pysr');
    expect(eq).toBe('y=2x');
    expect(starts[0].dataPoints).toEqual([3,4]);
    expect(successes[0].equation).toBe('y=2x');
  });

  it('records introspection logs', async () => {
    vi.spyOn(axios, 'post').mockResolvedValue({ data: { equation: 'y=3x' } });
    introspectionLog.length = 0;
    const eq = await callPySRService([5,6], 'http://localhost/pysr');
    expect(eq).toBe('y=3x');
    expect(introspectionLog.length).toBeGreaterThan(1);
    expect(introspectionLog[0].message).toMatch(/start/);
  });
});
