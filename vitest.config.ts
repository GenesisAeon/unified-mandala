import { defineConfig } from "vitest/config";
import os from "node:os";

const CPU = Math.max(1, Math.floor(os.cpus().length / 2));
const WORKERS = Number(process.env.VITEST_WORKERS || 1); // default 1 → speicherschonend

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Vermeidet OOM durch Single-Worker-Run; bei Bedarf via env hochdrehen:
    pool: "threads",
    maxWorkers: WORKERS || CPU,
    minWorkers: 1,
    isolate: true,
    sequence: { concurrent: false },
    testTimeout: 30_000,
    hookTimeout: 30_000,
    coverage: {
      provider: "v8",
      enabled: false, // Coverage optional – kann OOM triggern, bei Bedarf in CI einschalten
    },
    watch: false,
  },
  // Große Verzeichnisse ausschließen (Scan & Memory ↓)
  server: { watch: { ignored: ["**/data/**", "**/out/**", "**/dist/**"] } },
  optimizeDeps: { exclude: ["stream-json"] }, // vermeidet falsches Vorbundling
});
