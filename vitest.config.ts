import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'packages/agents/**/*.{test,spec}.ts',
      'packages/boundary-engine/**/*.{test,spec}.ts',
      'packages/api/**/*.{test,spec}.ts',
      'packages/crep/**/*.{test,spec}.ts',
      'scripts/**/*.{test,spec,vitest}.ts',
      'tests/**/*.{test,spec}.ts',
      'docs/**/*.{test,spec}.ts',
      'packages/wissenschaftliche-versuche/**/*.{test,spec}.ts',
      'packages/consent-mesh/**/*.{test,spec}.ts',
      'packages/federated/**/*.{test,spec}.ts',
      'packages/redaction/**/*.{test,spec}.ts'
    ],
    environment: 'node'
  }
});
