const spawn = require("cross-spawn");
const { resolveBin } = require("../utility");
const yargsParser = require("yargs-parser");

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);
const relativeArgs = args.map(a => a.replace(`${process.cwd()}/`, ""));

const filesToApply = parsedArgs._.length ? [] : ["**/*.js"];

// run the prettier script
const result = spawn.sync(
  resolveBin("prettier"),
  [...filesToApply, ...relativeArgs, "--write"],
  {
    stdio: "inherit"
  }
);

process.exit(result.status);
