const { resolve } = require("path");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testPathIgnorePatterns: ["<rootDir>/cypress/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^@src/(.*)": resolve(__dirname, "./src/$1"),
    "^@tests/(.*)": resolve(__dirname, "./__tests__/$1"),
  },
};
