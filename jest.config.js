module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: ['**/**/*.test.ts'],
  collectCoverage: true,
  coverageReporters: ['html'],
};
