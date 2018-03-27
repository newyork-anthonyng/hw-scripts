const fs = require("fs");
const path = require("path");
const readPkgUp = require("read-pkg-up");

const { pkg } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd())
});

function resolveHwScripts() {
  if (pkg.name === "hw-scripts") {
    return require.resolve("./").replace(process.cwd(), ".");
  }
  return resolveBin("hw-scripts");
}

function resolveBin(name, { executable = name } = {}) {
  const packagePath = require.resolve(`${name}/package.json`);
  const packageDir = path.dirname(packagePath);
  const { bin } = require(packagePath);

  if (typeof bin === "string") {
    return path.join(packageDir, bin);
  }

  return path.join(packageDir, bin[name]);
}

module.exports = {
  resolveHwScripts,
  resolveBin
};
