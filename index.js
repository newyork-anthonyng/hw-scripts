#!/usr/bin/env node

const path = require("path");
const spawn = require("cross-spawn");
const glob = require("glob");

const [executor, ignoredBin, script, ...args] = process.argv;

if (script) {
  spawnScript(script);
} else {
  // if the script is not available...
  const scriptsPath = path.join(__dirname, "scripts/");
  const scriptsAvailable = glob.sync(path.join(__dirname, "scripts", "*"));
  const scriptsAvailableMessage = scriptsAvailable
    .map(path.normalize)
    .map(s =>
      s
        .replace(scriptsPath, "")
        .replace(/__tests__/, "")
        .replace(/\.js$/, "")
    )
    .filter(Boolean)
    .join("\n ")
    .trim();
  const fullMessage = `
Usage: ${ignoredBin} [script] [--flags]

Available Scripts:
  ${scriptsAvailableMessage}
`;
  console.log(`\n${fullMessage}\n`);
}

function spawnScript(script) {
  const relativeScriptPath = path.join(__dirname, "./scripts/", script);
  const scriptPath = attemptResolve(relativeScriptPath);

  // scriptPath will be null if the script does not exist.
  if (!scriptPath) {
    throw new Error(`Unknown script "${script}".`);
  }

  // executes the script in a child process
  const result = spawn.sync(executor, [scriptPath, ...args], {
    stdio: "inherit",
    env: getEnv(script)
  });

  if (result.signal) {
    handleSignal(result, script);
  } else {
    process.exit(result.status);
  }
}

function handleSignal(result, script) {
  if (result.signal === "SIGKILL") {
    console.log(
      `The script "${script}" failed because the process exited too early.
      This probably means the system ran out of memory or someone called 'kill -9' on the process.`
    );
  } else if (result.signal === "SIGTERM") {
    console.log(
      `The script "${script}" failed because the process exited too early. Someone might have called 'kill' or 'killall', or the system could be shutting down.`
    );
  }
  process.exit(1);
}

function attemptResolve(...resolveArgs) {
  try {
    // To get the exact filename that will be loaded when require() is called, use the require.resolve() function.
    return require.resolve(...resolveArgs);
  } catch (error) {
    return null;
  }
}

function getEnv(script) {
  // remove `undefined` from our environment variables
  return Object.keys(process.env)
    .filter(key => process.env[key] !== undefined)
    .reduce(
      (envCopy, key) => {
        envCopy[key] = process.env[key];
        return envCopy;
      },
      {
        [`SCRIPTS_${script.toUpperCase()}`]: true
      }
    );
}
