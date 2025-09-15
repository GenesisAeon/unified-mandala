import { defineConfig } from "vitest/config";

type Suite = "core" | "extended" | "experimental";

const rawSuite = (process.env.UM_TEST_SUITE ?? "core").toLowerCase();
const suite: Suite = rawSuite === "extended" || rawSuite === "experimental" ? rawSuite : "core";

const baseExclude = ["**/node_modules/**", "**/dist/**"];
const extendedOnly = [
  "tests/**/*.{extended,slow}.{test,spec}.ts",
  "tests/**/*.extended.{test,spec}.ts",
  "tests/**/*.slow.{test,spec}.ts",
  "tests/**/extended/**",
  "tests/**/slow/**",
  "tests/smoke/**",
  "tests/**/*.{e2e,perf}.{test,spec}.ts",
  "tests/**/e2e/**",
  "tests/**/perf/**",
];
const experimentalOnly = [
  "tests/**/*.{experimental,chaos}.{test,spec}.ts",
  "tests/**/*.experimental.{test,spec}.ts",
  "tests/**/*.chaos.{test,spec}.ts",
  "tests/**/experimental/**",
  "tests/**/chaos/**",
  "tests/redteam/**",
];

const excludeBySuite: Record<Suite, string[]> = {
  core: [...baseExclude, ...extendedOnly, ...experimentalOnly],
  extended: [...baseExclude, ...experimentalOnly],
  experimental: [...baseExclude],
};

if (process.env.CI) {
  // Surface the chosen suite in CI logs without breaking config evaluation.
  console.info(`[vitest] running ${suite} suite`);
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
    exclude: excludeBySuite[suite],
  },
});

