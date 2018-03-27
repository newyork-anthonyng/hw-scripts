const { resolveBin, resolveHwScripts } = require("../utility");

const hwScripts = resolveHwScripts();

module.exports = {
  linters: {
    "**/*.+(js|less)": [`${hwScripts} pretty`]
  }
};
