const core = require("@actions/core");
const toolCache = require("@actions/tool-cache");
const path = require("path");

const { restoreRPCCache } = require("./cache");
const { getDownloadObject } = require("./utils");

async function main() {
  try {
    // Get version input
    const version = core.getInput("version");
    // Get artifact repository input
    const repository = core.getInput("repository");
    const repositoryAuth = core.getInput("repository-auth");

    // Download the archive containing the binaries
    const download = getDownloadObject(repository, version);
    core.info(`Downloading Foundry '${version}' from: ${download.url}`);
    const pathToArchive = await toolCache.downloadTool(download.url, '', repositoryAuth);

    // Extract the archive onto host runner
    core.debug(`Extracting ${pathToArchive}`);
    const extract = download.url.endsWith(".zip") ? toolCache.extractZip : toolCache.extractTar;
    const pathToCLI = await extract(pathToArchive);

    // Expose the tool
    core.addPath(path.join(pathToCLI, download.binPath));

    // Get cache input
    const cache = core.getInput("cache");

    if (cache) {
      // Restore the RPC cache, if any.
      await restoreRPCCache();
    }
  } catch (err) {
    core.setFailed(err);
  }
}

module.exports = main;

if (require.main === module) {
  main();
}
