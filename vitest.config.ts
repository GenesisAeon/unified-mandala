import { defineConfig } from 'vitest/config';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const toBool = (value: string | undefined) => value === '1' || value?.toLowerCase() === 'true';

const otelStubRoot = fileURLToPath(new URL('./tests/__mocks__/otel-api', import.meta.url));
const require = createRequire(import.meta.url);
const ipaddrEntry = require.resolve('ipaddr.js');
const resolveOtelStub = (id: string): string | null => {
  const aliases = new Map<string, string>([
    ['@opentelemetry/api', path.join(otelStubRoot, 'index.ts')],
    ['@opentelemetry/api/index.js', path.join(otelStubRoot, 'index.ts')],
    ['@opentelemetry/api/build/esm', path.join(otelStubRoot, 'build/esm/index.ts')],
    ['@opentelemetry/api/build/esm/index.js', path.join(otelStubRoot, 'build/esm/index.ts')],
  ]);
  const direct = aliases.get(id);
  if (direct) return direct;
  if (id.startsWith('@opentelemetry/api/')) {
    const suffix = id.slice('@opentelemetry/api/'.length);
    const candidates = [
      path.join(otelStubRoot, `${suffix}.ts`),
      path.join(otelStubRoot, `${suffix}.js`),
      path.join(otelStubRoot, suffix),
      path.join(otelStubRoot, suffix, 'index.ts'),
      path.join(otelStubRoot, suffix, 'index.js'),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }
  return null;
};

const runExtended = toBool(process.env.ENABLE_EXTENDED_TESTS);
const runExperimental = toBool(process.env.ENABLE_EXPERIMENTAL_TESTS);

const extendedGlobs = [
  'tests/**/*.{integration,extended}.{test,spec}.ts',
  'tests/**/*.{integration,extended}.{test,spec}.tsx',
  'tests/**/*.{smoke}.{test,spec}.ts',
  'tests/**/*.{smoke}.{test,spec}.tsx',
  'tests/**/smoke/**/*',
  'tests/**/redteam/**/*',
  'tests/**/*.cy.ts',
];

const experimentalGlobs = [
  'tests/**/experimental/**/*',
  'tests/**/*.{experimental}.{test,spec}.ts',
  'tests/**/*.{experimental}.{test,spec}.tsx',
];

const exclude = new Set<string>();
if (!runExtended) {
  for (const pattern of extendedGlobs) exclude.add(pattern);
}
if (!runExperimental) {
  for (const pattern of experimentalGlobs) exclude.add(pattern);
}

export default defineConfig({
  plugins: [
    {
      name: 'um-otel-stub-resolver',
      enforce: 'pre',
      resolveId(source) {
        const resolved = resolveOtelStub(source);
        if (resolved) {
          return resolved;
        }
        return null;
      },
    },
  ],
  cacheDir: 'tmp/.vite',
  resolve: {
    conditions: ['vitest', 'test', 'development', 'import'],
    mainFields: ['main', 'module', 'browser'],
    alias: {
      '@config': path.resolve(__dirname, 'config'),
      '@mandala/boundary-core': path.resolve(__dirname, 'stubs/boundary-core.ts'),
      '@opentelemetry/api': fileURLToPath(new URL('./tests/__mocks__/otel-api', import.meta.url)),
      '@opentelemetry/api/index.js': fileURLToPath(
        new URL('./tests/__mocks__/otel-api/index.ts', import.meta.url),
      ),
      '@opentelemetry/api/build/esm': fileURLToPath(
        new URL('./tests/__mocks__/otel-api/build/esm', import.meta.url),
      ),
      '@opentelemetry/api/build/esm/index.js': fileURLToPath(
        new URL('./tests/__mocks__/otel-api/build/esm/index.ts', import.meta.url),
      ),
      tldts: fileURLToPath(new URL('./tests/__mocks__/tldts.ts', import.meta.url)),
      'ipaddr.js': ipaddrEntry,
    },
    preserveSymlinks: true,
  },
  test: {
    environment: 'node',
    setupFiles: ['tests/setup/ci.ts'],
    globals: true,
    pool: 'threads',
    poolOptions: { threads: { singleThread: true } },
    server: {
      deps: {
        inline: [
          /^@unified-mandala\/ai$/,
          /^openai$/,
          /^nats$/,
          /^express$/,
          /^react$/,
          /^@opentelemetry\/api(\/.*)?$/,
          /^ipaddr\.js$/,
        ],
      },
    },
    deps: {
      optimizer: {
        enabled: false,
        ssr: {
          include: ['@unified-mandala/ai', 'openai', 'nats', 'express', 'react', 'ipaddr.js'],
        },
      },
    },
    coverage: {
      enabled: false,
      include: ['src/**/*.ts', 'packages/*/src/**/*.ts', 'apps/api/src/**/*.ts'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        'scripts/**',
        'tests/**',
        'vitest.setup.ts',
        '**/tmp_*.*',
        '**/tmp_*/**',
        // Demo/agents and non-TS proxy
        'unified-mandala/agents/**',
        'apps/api-lite/**',
        // UI TSX: components/pages/panels and story files
        'apps/**/components/**',
        'apps/**/pages/**',
        'apps/**/panels/**',
        // Exclude UI source tree and config/services from coverage
        'apps/ui/src/**',
        'apps/ui/src/config/**',
        'apps/ui/src/services/**',
        // Agent routes are covered by colocated tests
        '**/*.stories.tsx',
        '**/*.stories.ts',
        // Common bootstrap files not unit-tested
        'main.ts',
        'main.tsx',
        // Note: do not globally exclude index.* to avoid hiding coverage for small packages
        'cli.js',
        // workspace-specific misc and non-unit scripts in AI package
        'GenesisAeonZIPMEM/**',
        'unified-mandala/GenesisAeonZIPMEM/**',
        'packages/ai/src/dev.ts',
        'packages/ai/src/index.ts',
        'packages/ai/src/nats-worker.ts',
        'packages/ai/src/agent/**',
        'packages/ai/src/guards/**',
        // Exclude archetype-analyzer package for now (no unit tests yet)
        'packages/archetype-analyzer/src/**',
        // Exclude audit-trail package for now (minimal stubs/no unit targets)
        'packages/audit-trail/src/**',
        // Exclude biosensor-gateway stub package from unit coverage
        'packages/biosensor-gateway/src/**',
        // Exclude coherence-agent package until tests are added
        'packages/coherence-agent/src/**',
        // Exclude creative-dreamer package until tests exist
        'packages/creative-dreamer/src/**',
        // Exclude trivial index barrel for crep package to avoid 0% noise
        'packages/crep/src/index.ts',
        // Exclude crep-plugin-api package until tests exist
        'packages/crep-plugin-api/src/**',
        // Exclude type-only module to avoid 0% noise
        'packages/epistemic/src/evidence.ts',
        // Exclude ethic-guardian package until tests are added
        'packages/ethic-guardian/src/**',
        // Exclude full epistemic package if we are not focusing on it now
        'packages/epistemic/src/**',
        // Exclude grok-agent package until tests exist
        'packages/grok-agent/src/**',
        // Exclude meme-chronicle stub package from coverage for now
        'packages/meme-chronicle/src/**',
        // Exclude synchronizer stub package from coverage for now
        'packages/synchronizer/src/**',
        // Exclude VR package core (three/react-three integration not unit-tested here)
        'packages/unifiedmandala-vr/src/**',
      ],
    },
    include: [
      'tests/**/*.{test,spec}.ts',
      'src/**/tests/**/*.{test,spec}.ts',
      'src/**/__tests__/**/*.{test,spec}.{ts,tsx}',
      'packages/**/test/**/*.{test,spec}.ts',
      'packages/**/src/**/*.{test,spec}.ts',
      'apps/**/src/**/*.{test,spec}.ts',
      'scripts/opa/__tests__/**/*.test.mjs',
    ],
    exclude: ['**/node_modules/**', ...Array.from(exclude)],
  },
});
