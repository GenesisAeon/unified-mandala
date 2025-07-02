import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { PoeticReactorAgent } from './PoeticReactorAgent';

describe('PoeticReactorAgent', () => {
  it('returns haiku when CREP threshold exceeded', () => {
    const agent = new PoeticReactorAgent(50);
    const haiku = agent.observe(60);
    expect(haiku).toBeTruthy();
  });

  it('returns null below threshold', () => {
    const agent = new PoeticReactorAgent(70);
    expect(agent.observe(40)).toBeNull();
  });
});
