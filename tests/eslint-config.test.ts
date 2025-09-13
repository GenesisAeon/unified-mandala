// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../.eslintrc.cjs');

test('ESLint config includes recommended rules', () => {
  expect(config.extends).toContain('eslint:recommended');
  expect(config.extends).toContain('plugin:@typescript-eslint/recommended');
});
