import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts", "tests/setup/ci.ts"],
    pool: "threads",
    poolOptions: { threads: { singleThread: true } },
    isolate: true,
    sequence: { concurrent: false },
    testTimeout: 30_000,
    hookTimeout: 30_000,
    coverage: { provider: "v8", enabled: false },
    watch: false,
  },
  // Große Verzeichnisse ausschließen (Scan & Memory ↓)
  server: { watch: { ignored: ["**/data/**", "**/out/**", "**/dist/**"] } },
  optimizeDeps: { exclude: ["stream-json"] }, // vermeidet falsches Vorbundling
});
