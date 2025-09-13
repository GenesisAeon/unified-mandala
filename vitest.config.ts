import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["tests/setup/ci.ts"],
    globals: true,
    pool: "threads",
    poolOptions: { threads: { singleThread: true } },
    coverage: { enabled: false },
    include: ["tests/**/*.{test,spec}.ts"],
  },
});

