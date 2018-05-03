module.exports = require("yargs")
  .option("browsers", {
    alias: "b",
    default: ["chrome:headless"],
    describe: "List of browsers to test in with testcafe",
    type: "array"
  })
  .option("ports", {
    alias: "p",
    default: [1337, 1338],
    describe: "Ports that will be used to serve tested webpages",
    type: "array"
  })
  .option("specs", {
    alias: "s",
    default: "./Specs/Features/**/*.feature",
    describe: "Path(s) or Pattern(s) leading to your specification files",
    type: "array"
  })
  .option("steps", {
    alias: "d",
    default: "./Specs/Definitions/**/*.js",
    describe: "Path(s) or Pattern(s) leading to your step definition files",
    type: "array"
  });
