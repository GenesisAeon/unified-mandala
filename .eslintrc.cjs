module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  ignorePatterns: [
    'dist/',
    'coverage/',
    'out/',
    'node_modules/',
    '*.d.ts',
    '*.generated.*',
  ],
  reportUnusedDisableDirectives: false,
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/prefer-as-const': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'prefer-const': 'warn',
    'no-empty': 'warn',
    'no-control-regex': 'off',
    'no-useless-escape': 'warn',
  },
  overrides: [
    {
      files: ['**/*.test.*', '**/*.spec.*'],
      env: {
        jest: true,
        node: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['**/*.config.*', 'scripts/**/*.{ts,js,cjs,mjs}'],
      env: {
        node: true,
      },
    },
  ],
};
