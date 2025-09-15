import * as core from "@actions/core";
import * as toolCache from "@actions/tool-cache";
import path from "path";

import { restoreRPCCache } from "./cache";
import { getDownloadObject } from "./utils";

async function main() {
  try {
    // Get version input
    const version = core.getInput("version");

    // Download the archive containing the binaries
    const download = getDownloadObject(version);
    core.info(`Downloading Foundry '${version}' from: ${download.url}`);
    const pathToArchive = await toolCache.downloadTool(download.url);

    // Extract the archive onto host runner
    core.debug(`Extracting ${pathToArchive}`);
    const extract = download.url.endsWith(".zip") ? toolCache.extractZip : toolCache.extractTar;
    const pathToCLI = await extract(pathToArchive);

    // Expose the tool
    core.addPath(path.join(pathToCLI, download.binPath));

    // Get cache input
    const cache = core.getBooleanInput("cache");

    // If cache input is false, skip restoring cache
    if (!cache) {
      core.info("Cache not requested, not restoring cache");
      return;
    }

    // Restore the RPC cache
    await restoreRPCCache();
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(err);
    } else {
      core.setFailed(String(err));
    }
  }
}

module.exports = main;

if (require.main === module) {
  main();
}
