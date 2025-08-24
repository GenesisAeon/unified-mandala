import { describe, it, expect } from 'vitest';
import FutureKIAgent from '../FutureKIAgent';

describe('FutureKIAgent', () => {
  it('loads predictions', () => {
    const agent = new FutureKIAgent();
    expect(agent.list().length).toBeGreaterThan(0);
  });

  it('returns prediction for year', () => {
    const agent = new FutureKIAgent();
    expect(agent.predict(2030)).toMatch(/KI/);
  });
});
