import { configDefaults, defineConfig } from "vitest/config";

const EXTENDED_PATTERNS = [
  "tests/redteam/**",
  "tests/smoke/**",
  "tests/event-bus/**",
  "tests/**/rag.flow.test.ts",
  "tests/**/realtime.flow.test.ts",
  "tests/gpt5-smoke.test.ts",
  "tests/pantheon_k8s.test.ts",
  "tests/agents/**",
];

const enableExtended =
  ["1", "true", "on"].includes((process.env.UM_ENABLE_EXTENDED_TESTS || "").toLowerCase());

const exclude = enableExtended
  ? configDefaults.exclude
  : [...configDefaults.exclude, ...EXTENDED_PATTERNS];

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["tests/setup/ci.ts"],
    globals: true,
    pool: "threads",
    poolOptions: { threads: { singleThread: true } },
    coverage: { enabled: false },
    include: ["tests/**/*.{test,spec}.ts"],
    exclude,
    env: {
      UM_TEST_MODE: enableExtended ? "extended" : "core",
    },
  },
});

