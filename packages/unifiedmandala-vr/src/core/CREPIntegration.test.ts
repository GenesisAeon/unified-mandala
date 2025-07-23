const { CREPIntegration } = require('./CREPIntegration');

describe('CREPIntegration', () => {
  it('invokes callbacks on emit', () => {
    const integration = new CREPIntegration();
    let value = 0;
    integration.onUpdate((v: number) => (value = v));
    integration.emit(5);
    expect(value).toBe(5);
  });
});
