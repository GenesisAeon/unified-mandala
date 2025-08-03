import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'packages/agents/**/*.{test,spec}.ts',
      'packages/boundary-engine/**/*.{test,spec}.ts',
      'packages/api/**/*.{test,spec}.ts',
      'scripts/**/*.{test,spec}.ts'
    ],
    environment: 'node'
  }
});
