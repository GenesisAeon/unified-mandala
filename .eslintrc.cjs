module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['import', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  env: {
    node: true,
    es2020: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
  },
  rules: {
    'import/no-unresolved': 'error',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-duplicates': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-empty': 'off',
    'no-constant-condition': 'off',
    'prefer-const': 'off',
    'no-useless-escape': 'off',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/consistent-generic-constructors': 'off',
        '@typescript-eslint/consistent-indexed-object-style': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/prefer-as-const': 'off',
        '@typescript-eslint/triple-slash-reference': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: [
        'scripts/**/__tests__/**/*.{ts,tsx}',
        'scripts/**/*.test.{ts,tsx}',
        'scripts/**/*.spec.{ts,tsx}',
        'tests/**/*.{ts,tsx}',
        'services/**/*.{test,spec}.ts',
        'src/ui/panels/SigillinIndexPanel.tsx',
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
