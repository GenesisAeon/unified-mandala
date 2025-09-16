import { defineConfig } from "vitest/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = dirname(fileURLToPath(import.meta.url));
const fromRoot = (...segments: string[]) => resolve(configDir, "..", ...segments);

const vitestTsconfig = fromRoot("tsconfig.vitest.json");
process.env.TS_NODE_PROJECT ??= vitestTsconfig;
process.env.VITEST_TS_NODE_PROJECT ??= vitestTsconfig;

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: [
      fromRoot("vitest.setup.ts"),
      fromRoot("tests/setup/ci.ts"),
    ],
    include: [
      "tests/**/*.{test,spec}.ts",
      "tests/**/*.{test,spec}.tsx",
    ],
    exclude: [
      "**/*.extended.*",
      "**/*.e2e.*",
      "tests/**/experimental/**",
    ],
    pool: "threads",
    css: false,
    passWithNoTests: false,
  },
  esbuild: {
    target: "es2022",
  },
  resolve: {
    conditions: ["node", "import", "default"],
  },
});
