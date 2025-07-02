// eslint-disable-next-line @typescript-eslint/no-var-requires
const coverageConfig = require('../jest.config.js');

test('coverage enabled', () => {
  expect(coverageConfig.collectCoverage).toBe(true);
});
