const { resolve } = require("path");
require("@testing-library/jest-dom");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testPathIgnorePatterns: ["<rootDir>/cypress/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^@src/(.*)": resolve(__dirname, "./src/$1"),
    "^@fixtures/(.*)": resolve(__dirname, "./__tests__/fixtures/$1"),
    "^@mocks/(.*)": resolve(__dirname, "./__tests__/mocks/$1"),
  },
};
