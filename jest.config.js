const pack = require("./package");

module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/pkg", "<rootDir>/tests"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/output/"],
  testRegex: [".spec.ts$"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coveragePathIgnorePatterns: ["<rootDir>/__tests__", "<rootDir>/lib"],
  verbose: true,
  name: pack.name,
  displayName: pack.name,
};