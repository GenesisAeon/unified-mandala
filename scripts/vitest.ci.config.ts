import { defineConfig } from "vitest/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ensureColumns = (stream: typeof process.stdout | typeof process.stderr | undefined) => {
  if (!stream) return;
  const columns = (stream as any).columns;
  if (!Number.isFinite(columns) || columns === 0) {
    try {
      Object.defineProperty(stream, "columns", {
        configurable: true,
        enumerable: false,
        get: () => 80,
      });
    } catch {
      /* noop */
    }
  }
};

ensureColumns(process.stdout as typeof process.stdout | undefined);
ensureColumns(process.stderr as typeof process.stderr | undefined);

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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

const exclude = new Set<string>([
  "**/*.extended.*",
  "**/*.e2e.*",
]);

if (!runExtended) {
  for (const pattern of extendedGlobs) exclude.add(pattern);
}
if (!runExperimental) {
  for (const pattern of experimentalGlobs) exclude.add(pattern);
}

const setupFiles = [
  resolve(rootDir, "vitest.setup.ts"),
  resolve(rootDir, "tests/setup/ci.ts"),
];

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles,
    include: [
      "tests/**/*.{test,spec}.ts",
      "tests/**/*.{test,spec}.tsx",
    ],
    exclude: Array.from(exclude),
    pool: "threads",
    css: false,
    passWithNoTests: false,
  },
  esbuild: { target: "es2022" },
  resolve: { conditions: ["node", "import", "default"] },
});
