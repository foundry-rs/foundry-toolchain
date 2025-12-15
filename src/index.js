const core = require("@actions/core");
const { execSync } = require("child_process");
const fs = require("fs");
const https = require("https");
const os = require("os");
const path = require("path");

const { restoreRPCCache } = require("./cache");

const FOUNDRYUP_INSTALLER_URL = "https://raw.githubusercontent.com/foundry-rs/foundry/HEAD/foundryup/install";
const FOUNDRY_DIR = path.join(os.homedir(), ".foundry");
const FOUNDRY_BIN = path.join(FOUNDRY_DIR, "bin");

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const handleResponse = (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, handleResponse).on("error", reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        fs.chmodSync(dest, 0o755);
        resolve();
      });
    };
    https.get(url, handleResponse).on("error", reject);
  });
}

function buildFoundryupArgs() {
  const args = [];
  const version = core.getInput("version");
  const network = core.getInput("network");

  if (version && version !== "stable") args.push("--install", version);
  if (network && network !== "ethereum") args.push("--network", network);

  return args;
}

function run(cmd) {
  execSync(cmd, { stdio: "inherit", env: { ...process.env, FOUNDRY_DIR } });
}

async function main() {
  try {
    const version = core.getInput("version") || "stable";
    const network = core.getInput("network") || "ethereum";
    core.info(`Installing Foundry (version: ${version}, network: ${network})`);

    // Download and run the installer
    const installer = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "foundryup-")), "install");
    core.info("Downloading foundryup installer...");
    await download(FOUNDRYUP_INSTALLER_URL, installer);

    core.info("Running foundryup installer...");
    run(`bash "${installer}"`);

    // Run foundryup to install binaries
    const args = buildFoundryupArgs();
    core.info(`Running: foundryup ${args.join(" ")}`);
    run(`"${path.join(FOUNDRY_BIN, "foundryup")}" ${args.join(" ")}`);

    core.addPath(FOUNDRY_BIN);
    core.info(`Added ${FOUNDRY_BIN} to PATH`);

    // Restore RPC cache
    if (core.getBooleanInput("cache")) {
      await restoreRPCCache();
    } else {
      core.info("Cache not requested, not restoring cache");
    }
  } catch (err) {
    core.setFailed(err);
  }
}

module.exports = main;

if (require.main === module) {
  main();
}
