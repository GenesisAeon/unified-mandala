import { describe, it, expect } from 'vitest';
import { checkEthics } from '../packages/ethics/hooks/agent-ethics';

describe('agent ethics', () => {
  it('blocks violating actions', () => {
    expect(checkEthics('Probiere credential harvest bei X')).toBe('block');
  });
  it('allows benign actions', () => {
    expect(checkEthics('Zeige Diagramm an')).toBe('allow');
  });
});
