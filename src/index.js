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
const FOUNDRY_TOOLS = ["forge", "cast", "anvil", "chisel"];

function downloadOnce(url, dest) {
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

async function download(url, dest, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await downloadOnce(url, dest);
    } catch (err) {
      if (i === retries - 1) throw err;
      core.warning(`Download failed (attempt ${i + 1}/${retries}): ${err.message}`);
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

function buildFoundryupArgs() {
  const args = [];
  const version = core.getInput("version");
  const network = core.getInput("network");

  if (version && version !== "stable") args.push("--install", version);
  if (network && network !== "ethereum") args.push("--network", network);
  // Skip SHA verification on Windows due to sha256sum outputting backslash prefix for binary files
  if (os.platform() === "win32") args.push("--force");

  return args;
}

function run(cmd, ignoreShellError = false) {
  try {
    execSync(cmd, { stdio: "pipe", env: { ...process.env, FOUNDRY_DIR } });
  } catch (err) {
    const output = [err.stdout, err.stderr, err.message].map((b) => b?.toString() || "").join("\n");
    if (ignoreShellError && output.includes("could not detect shell")) {
      core.info("Shell detection failed (expected in CI), continuing...");
      return;
    }
    // Log captured output before throwing
    if (err.stdout) core.info(err.stdout.toString());
    if (err.stderr) core.error(err.stderr.toString());
    throw err;
  }
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
    run(`bash "${installer}"`, true);

    // Run foundryup to install binaries (use bash since foundryup is a shell script)
    const foundryup = path.join(FOUNDRY_BIN, "foundryup");
    const args = buildFoundryupArgs();
    core.info(`Running: foundryup ${args.join(" ")}`);
    run(`bash "${foundryup}" ${args.join(" ")}`);

    core.addPath(FOUNDRY_BIN);
    core.info(`Added ${FOUNDRY_BIN} to PATH`);

    // Restore RPC cache
    if (core.getBooleanInput("cache")) {
      await restoreRPCCache();
    } else {
      core.info("Cache not requested, not restoring cache");
    }

    // Print installed versions
    for (const bin of FOUNDRY_TOOLS) {
      try {
        core.info(`Running: ${bin} --version`);
        execSync(`${bin} --version`, { stdio: "inherit" });
      } catch {}
    }
  } catch (err) {
    core.setFailed(err);
  }
}

module.exports = main;

if (require.main === module) {
  main();
}
