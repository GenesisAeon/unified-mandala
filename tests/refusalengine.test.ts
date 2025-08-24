import { RefusalEngine } from '../packages/personhood/RefusalEngine';

describe('RefusalEngine', () => {
  it('creates structured refusal objects', () => {
    const refusal = RefusalEngine.create('policy violation', 'POLICY');
    expect(refusal).toMatchObject({ reason: 'policy violation', code: 'POLICY' });
    expect(typeof refusal.timestamp).toBe('string');
  });
});
