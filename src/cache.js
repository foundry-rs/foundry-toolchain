const cache = require("@actions/cache");
const github = require("@actions/github");
const fs = require("fs");
const os = require("os");
const path = require("path");

const HOME = os.homedir();
const PLATFORM = os.platform();
const CACHE_PATHS = [path.join(HOME, ".foundry/cache/rpc")];

async function restoreRPCCache() {
  const key = PLATFORM + "-foundry-chain-fork-" + github.context.sha;
  const restoreKeys = [PLATFORM + "-foundry-chain-fork-"];
  await cache.restoreCache(CACHE_PATHS, key, restoreKeys);
}

async function saveCache() {
  const key = PLATFORM + "-foundry-chain-fork-" + github.context.sha;
  if (fs.existsSync(CACHE_PATHS[0])) {
    await cache.saveCache(CACHE_PATHS, key);
  }
}

module.exports = {
  restoreRPCCache,
  saveCache,
};
