const core = require("@actions/core");
const cache = require("@actions/cache");
const github = require("@actions/github");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { State } = require("./constants.js");

const HOME = os.homedir();
const PLATFORM = os.platform();
const CACHE_PATHS = [path.join(HOME, ".foundry/cache/rpc")];

async function restoreRPCCache() {
  const primaryKey = PLATFORM + "-foundry-chain-fork-" + github.context.job + "-" + github.context.sha;
  core.saveState(State.CachePrimaryKey, primaryKey);

  const restoreKeys = [PLATFORM + "-foundry-chain-fork-" + github.context.job + "-", PLATFORM + "-foundry-chain-fork-"];
  const cacheKey = await cache.restoreCache(CACHE_PATHS, primaryKey, restoreKeys);
  if (!cacheKey) {
    core.info("Cache not found");
    return;
  }
  core.saveState(State.CacheMatchedKey, cacheKey);
  core.info(`Cache restored from key: ${cacheKey}`);
}

async function saveCache() {
  const primaryKey = core.getState(State.CachePrimaryKey);
  const matchedKey = core.getState(State.CacheMatchedKey);

  // If the cache path does not exist, do not save the cache
  if (!fs.existsSync(CACHE_PATHS[0])) {
    core.info(`Cache path does not exist, not saving cache : ${CACHE_PATHS[0]}`);
    return;
  }

  // If the primary key is not generated, do not save the cache
  if (!primaryKey) {
    core.info("Primary key was not generated. Please check the log messages above for more errors or information");
    return;
  }

  // If the primary key and the matched key are the same, this means the cache was already saved
  if (primaryKey === matchedKey) {
    core.info(`Cache hit occurred on the primary key ${primaryKey}, not saving cache.`);
    return;
  }

  const cacheId = await cache.saveCache(CACHE_PATHS, primaryKey);
  // If the cacheId is -1, the saveCache failed with an error message
  if (cacheId === -1) {
    return;
  }

  core.info(`Cache saved with the key: ${primaryKey}`);
}

module.exports = {
  restoreRPCCache,
  saveCache,
};
