module.exports = {
  ...require('./jest-common'),
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  displayName: 'server',
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/__tests__/**/*.+(ts|js)'],
}
