import * as core from "@actions/core";
import { execSync } from "child_process";
import * as fs from "fs";
import * as https from "https";
import * as os from "os";
import * as path from "path";
import type { IncomingMessage } from "http";

import { restoreCache } from "./cache.js";

const FOUNDRYUP_INSTALLER_URL = "https://raw.githubusercontent.com/foundry-rs/foundry/HEAD/foundryup/install";
const FOUNDRY_DIR = path.join(os.homedir(), ".foundry");
const FOUNDRY_BIN = path.join(FOUNDRY_DIR, "bin");
const FOUNDRY_TOOLS = ["forge", "cast", "anvil", "chisel"];

function downloadOnce(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const handleResponse = (res: IncomingMessage): void => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
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

async function download(url: string, dest: string, retries = 3): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      return await downloadOnce(url, dest);
    } catch (err) {
      if (i === retries - 1) throw err;
      const message = err instanceof Error ? err.message : String(err);
      core.warning(`Download failed (attempt ${i + 1}/${retries}): ${message}`);
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

function buildFoundryupArgs(): string[] {
  const args: string[] = [];
  let version = core.getInput("version");
  const network = core.getInput("network");

  // Strip 'v' prefix from version if present (e.g., "v1.3.6" -> "1.3.6").
  if (version && version.startsWith("v")) {
    version = version.slice(1);
  }

  if (version && version !== "stable") args.push("--install", version);
  if (network && network !== "ethereum") args.push("--network", network);

  return args;
}

function run(cmd: string, ignoreShellError = false): void {
  try {
    execSync(cmd, { stdio: "pipe", env: { ...process.env, FOUNDRY_DIR } });
  } catch (err) {
    const execErr = err as { stdout?: Buffer; stderr?: Buffer; message?: string };
    const output = [execErr.stdout, execErr.stderr, execErr.message].map((b) => b?.toString() || "").join("\n");
    if (ignoreShellError && output.includes("could not detect shell")) {
      core.debug("Shell detection failed (expected in CI), continuing...");
      return;
    }
    // Log captured output before throwing.
    if (execErr.stdout) core.info(execErr.stdout.toString());
    if (execErr.stderr) core.error(execErr.stderr.toString());
    throw err;
  }
}

async function main(): Promise<void> {
  try {
    const version = core.getInput("version") || "stable";
    const network = core.getInput("network") || "ethereum";
    core.info(`Installing Foundry (version: ${version}, network: ${network})`);

    // Download and run the installer.
    const installer = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "foundryup-")), "install");
    core.info("Downloading foundryup installer...");
    await download(FOUNDRYUP_INSTALLER_URL, installer);

    core.info("Running foundryup installer...");
    run(`bash "${installer}"`, true);

    // Run foundryup to install binaries (use bash since foundryup is a shell script).
    const foundryup = path.join(FOUNDRY_BIN, "foundryup");
    const args = buildFoundryupArgs();
    core.info(`Running: foundryup ${args.join(" ")}`);
    run(`bash "${foundryup}" ${args.join(" ")}`);

    core.addPath(FOUNDRY_BIN);
    core.info(`Added ${FOUNDRY_BIN} to PATH`);

    // Restore cache.
    if (core.getBooleanInput("cache")) {
      await restoreCache();
    } else {
      core.info("Cache not requested, not restoring cache");
    }

    // Print installed versions.
    for (const bin of FOUNDRY_TOOLS) {
      try {
        core.info(`Running: ${bin} --version`);
        execSync(`${bin} --version`, { stdio: "inherit" });
      } catch {}
    }
  } catch (err) {
    core.setFailed(err instanceof Error ? err : String(err));
  }
}

export default main;

main();
