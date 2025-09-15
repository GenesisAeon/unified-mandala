import { defineConfig } from "vitest/config";

const scope = (process.env.UM_TEST_SCOPE ?? "core").toLowerCase();

const baseExclude = ["**/node_modules/**", "**/dist/**"];
const extendedOnly = [
  "tests/smoke/**/*",
  "tests/redteam/**/*",
  "tests/agents/golden/**/*",
  "tests/**/*.extended.test.ts",
  "tests/**/*.extended.spec.ts",
  "tests/**/*smoke*.test.ts",
  "tests/**/*smoke*.spec.ts",
];
const experimentalOnly = [
  "tests/experimental/**/*",
  "tests/**/*.experimental.test.ts",
  "tests/**/*.experimental.spec.ts",
];

const exclude = [...baseExclude];
if (scope === "core") {
  exclude.push(...extendedOnly, ...experimentalOnly);
} else if (scope === "extended") {
  exclude.push(...experimentalOnly);
}

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
  },
});

