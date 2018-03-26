const path = require("path");

function resolveBin(name, { executable = name } = {}) {
  const packagePath = require.resolve(`${name}/package.json`);
  const packageDir = path.dirname(packagePath);
  const { bin } = require(packagePath);
  console.log("packagePath", packagePath);
  console.log("packageDir", packageDir);
  console.log("bin", bin);

  if (typeof bin === "string") {
    console.log("string", path.join(packageDir, bin));
    return path.join(packageDir, bin);
  }

  console.log("no string", path.join(packageDir, bin[name]));
  return path.join(packageDir, bin[name]);
}

module.exports = {
  resolveBin
};
