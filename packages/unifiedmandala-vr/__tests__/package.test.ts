const pkg = require('../package.json');

describe('package.json', () => {
  it('has correct name', () => {
    expect(pkg.name).toBe('unifiedmandala-vr');
  });
});
