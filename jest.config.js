module.exports = {
  transform: { '^.+\\.tsx?$': ['<rootDir>/node_modules/ts-jest', {}] },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/dist/', '/packages/agents/__tests__/'],
  moduleNameMapper: {
    '^yaml$': '<rootDir>/node_modules/yaml/dist/index.js'
  },
  detectOpenHandles: true
};
