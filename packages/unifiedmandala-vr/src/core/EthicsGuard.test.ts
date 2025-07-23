const { EthicsGuard } = require('./EthicsGuard');

describe('EthicsGuard', () => {
  it('blocks banned words', () => {
    const guard = new EthicsGuard();
    expect(guard.isSafe('attack now')).toBe(false);
  });

  it('allows safe content', () => {
    const guard = new EthicsGuard();
    expect(guard.isSafe('hello world')).toBe(true);
  });
});
