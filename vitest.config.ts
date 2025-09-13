import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["tests/setup/ci.ts"],
    globals: true,
    pool: "threads",
    poolOptions: { threads: { singleThread: true } },
    isolate: true,
    sequence: { concurrent: false },
    testTimeout: 30_000,
    hookTimeout: 30_000,
    coverage: { provider: "v8", enabled: false },
    watch: false,
    include: ["tests/**/*.{test,spec}.ts"],
  },
  // Große Verzeichnisse ausschließen (Scan & Memory ↓)
  server: { watch: { ignored: ["**/data/**", "**/out/**", "**/dist/**"] } },
  optimizeDeps: { exclude: ["stream-json"] }, // vermeidet falsches Vorbundling
});
