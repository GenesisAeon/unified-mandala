import { defineConfig } from "vitest/config";

const toBool = (value: string | undefined) =>
  value === "1" || value?.toLowerCase() === "true";

const runExtended = toBool(process.env.ENABLE_EXTENDED_TESTS);
const runExperimental = toBool(process.env.ENABLE_EXPERIMENTAL_TESTS);

const extendedGlobs = [
  "tests/**/*.{integration,extended}.{test,spec}.ts",
  "tests/**/*.{integration,extended}.{test,spec}.tsx",
  "tests/**/*.{smoke}.{test,spec}.ts",
  "tests/**/*.{smoke}.{test,spec}.tsx",
  "tests/**/smoke/**/*",
  "tests/**/redteam/**/*",
  "tests/**/*.cy.ts",
];

const experimentalGlobs = [
  "tests/**/experimental/**/*",
  "tests/**/*.{experimental}.{test,spec}.ts",
  "tests/**/*.{experimental}.{test,spec}.tsx",
];

const exclude = new Set<string>();
if (!runExtended) {
  for (const pattern of extendedGlobs) exclude.add(pattern);
}
if (!runExperimental) {
  for (const pattern of experimentalGlobs) exclude.add(pattern);
}

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["tests/setup/ci.ts"],
    globals: true,
    pool: "threads",
    poolOptions: { threads: { singleThread: true } },
    coverage: { enabled: false },
    include: [
      "tests/**/*.{test,spec}.ts",
      "packages/**/test/**/*.{test,spec}.ts",
    ],
    exclude: Array.from(exclude),
  },
});

