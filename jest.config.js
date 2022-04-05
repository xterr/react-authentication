/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    "**/tests/**/*.[jt]s?(x)",
  ],
  collectCoverage: true,
  coverageReporters: [
    "text-summary",
    "text",
    "html"
  ],
  roots: [
    "<rootDir>/src/",
    "<rootDir>/tests/",
  ]
};
