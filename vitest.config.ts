import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/agents/**/*.spec.ts'],
    environment: 'node'
  }
});
