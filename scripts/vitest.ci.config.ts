import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.{test,spec}.ts"],
    exclude: ["**/*.extended.*", "**/*.e2e.*", "tests/**/experimental/**"],
    pool: "threads",
    css: false,
    passWithNoTests: false
  },
  esbuild: {
    target: "es2022"
  },
  resolve: {
    conditions: ["node", "import", "default"]
  }
});
