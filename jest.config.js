module.exports = {
  transform: { '^.+\\.tsx?$': ['<rootDir>/node_modules/ts-jest', {}] },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/dist/'],
  moduleNameMapper: {
    '^yaml$': '<rootDir>/node_modules/yaml/dist/index.js'
  },
  detectOpenHandles: true
};
