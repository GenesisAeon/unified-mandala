import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/agents/**/*.{test,spec}.ts'],
    environment: 'node'
  }
});
