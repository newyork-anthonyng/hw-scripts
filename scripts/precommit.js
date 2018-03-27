const spawn = require("cross-spawn");
const path = require("path");
const { resolveBin } = require("../utility");

const args = process.argv.slice(2);
const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), ".");

const lintStagedResult = spawn.sync(
  resolveBin("lint-staged"),
  ["--config", hereRelative("../config/lintstagedrc.js")],
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
