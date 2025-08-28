module.exports = {
  transform: { '^.+\\.tsx?$': ['<rootDir>/node_modules/ts-jest', {}] },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/dist/',
    'packages/agents',
    'packages/agents/__tests__',
    'packages/vr-integration',
    'services/ghost-shell/server.test.ts',
    'scripts',
    'packages/pantheon',
    'packages/gpt-bridges/router'
  ],
  moduleNameMapper: {
    '^yaml$': '<rootDir>/node_modules/yaml/dist/index.js',
    '^vitest$': '<rootDir>/tests/vitest-stub.js'
  },
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  detectOpenHandles: true
};
