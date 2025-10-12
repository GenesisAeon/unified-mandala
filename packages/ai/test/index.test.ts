import { describe, it, expect } from 'vitest';
import * as api from '../src/index';

describe('ai index re-exports', () => {
  it('exposes expected API surface', () => {
    expect(typeof api.createOpenAI).toBe('function');
    expect(typeof api.getOpenAI).toBe('function');
    expect(typeof api.askOpenAI).toBe('function');
    expect(typeof api.agentTools).toBe('object');
    expect(typeof api.resolveURI).toBe('function');
    expect(typeof api.readFileURI).toBe('function');
  });
});

