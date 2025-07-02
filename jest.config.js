module.exports = {
  transform: { '^.+\\.tsx?$': ['<rootDir>/node_modules/ts-jest', {}] },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/dist/', 'packages/agents/__tests__', 'services/ghost-shell/server.test.ts'],
  moduleNameMapper: {
    '^yaml$': '<rootDir>/node_modules/yaml/dist/index.js'
  },
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  detectOpenHandles: true
};
