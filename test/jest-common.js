const path = require("path")

module.exports = {
  rootDir: path.join(__dirname, ".."),
  moduleDirectories: ["node_modules", path.join(__dirname, "../utils")],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  watchPlugins: [
    "jest-watch-select-projects",
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
    "jest-runner-eslint/watch-fix",
  ],
}
