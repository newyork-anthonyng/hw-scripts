const spawn = require("cross-spawn");

const validateResult = spawn.sync("npm", ["run", "validate"], {
  stdio: "inherit"
});

process.exit(validateResult.status);
