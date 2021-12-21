export default {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  extensionsToTreatAsEsm: ['.ts'],
  resolver: '<rootDir>/tests/jest-ts-resolver.ts',
  testTimeout: 60000000,
};
