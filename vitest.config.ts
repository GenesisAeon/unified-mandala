import { defineConfig } from 'vitest/config';
import path from 'node:path';

const toBool = (value: string | undefined) => value === '1' || value?.toLowerCase() === 'true';

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
  cacheDir: 'tmp/.vite',
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, 'config'),
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
        inline: [/^@unified-mandala\/ai$/, /^openai$/, /^nats$/, /^express$/, /^react$/],
      },
    },
    deps: {
      optimizer: {
        ssr: {
          include: ['@unified-mandala/ai', 'openai', 'nats', 'express', 'react'],
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
      'packages/**/test/**/*.{test,spec}.ts',
      'packages/**/src/**/*.{test,spec}.ts',
    ],
    exclude: Array.from(exclude),
  },
});
