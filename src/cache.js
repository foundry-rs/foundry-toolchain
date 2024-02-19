const core = require("@actions/core");
const cache = require("@actions/cache");
const github = require("@actions/github");
const fs = require("fs");
const os = require("os");
const path = require("path");

const HOME = os.homedir();
const PLATFORM = os.platform();
const CACHE_PATHS = [path.join(HOME, ".foundry/cache/rpc")];

async function restoreRPCCache() {
  const primaryKey = PLATFORM + "-foundry-chain-fork-" + github.context.sha;
  const restoreKeys = [PLATFORM + "-foundry-chain-fork-"];
  const cacheKey = await cache.restoreCache(CACHE_PATHS, primaryKey, restoreKeys);
  if (!cacheKey) {
    core.info("Cache not found");
    return;
  }
  core.info(`Cache restored from key: ${cacheKey}`);
}

async function saveCache() {
  const primaryKey = PLATFORM + "-foundry-chain-fork-" + github.context.sha;
  if (!fs.existsSync(CACHE_PATHS[0])) {
    core.info(`Cache path does not exist, not saving cache : ${CACHE_PATHS[0]}`);
    return;
  }
  const cacheId = await cache.saveCache(CACHE_PATHS, primaryKey);
  if (cacheId === -1) {
    return;
  }
  core.info(`Cache saved with the key: ${primaryKey}`);
}

module.exports = {
  restoreRPCCache,
  saveCache,
};
