module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'], // Run setup.js before tests
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js'],
  };
  