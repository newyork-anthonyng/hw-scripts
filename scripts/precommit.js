const spawn = require("cross-spawn");
const { resolveBin, resolveHwScripts } = require("../utility");

const args = process.args.slice(2);

const lintStagedResult = spawn.sync(
  resolveBin("lint-staged"),
  [
    "--config",
    {
      linters: {
        "**/*.+(js|less)": [`${kcdScripts} pretty`]
      }
    }
  ],
  {
    stdio: "inherit"
  }
);

if (lintStagedResult.status !== 0) {
  process.exit(lintStagedResult.status);
} else {
  const validateResult = spawn.sync("npm", ["run", "validate"], {
    stdio: "inherit"
  });

  process.exit(validateResult.status);
}
