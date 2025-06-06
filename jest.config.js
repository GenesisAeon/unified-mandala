module.exports = {
  transform: { '^.+\\.tsx?$': ['<rootDir>/node_modules/ts-jest', {}] },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/dist/'],
};
