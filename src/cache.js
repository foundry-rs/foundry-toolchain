const core = require("@actions/core");
const cache = require("@actions/cache");
const github = require("@actions/github");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { State } = require("./constants.js");

// Define constants for cache paths and prefix
const HOME = os.homedir();
const PLATFORM = os.platform();
const CACHE_PATHS = [path.join(HOME, ".foundry/cache/rpc")];
const CACHE_PREFIX = `${PLATFORM}-foundry-chain-fork-`;

/**
 * Constructs the primary key for the cache using a custom key input.
 * @param {string} customKeyInput - The custom part of the key provided by the user.
 * @returns {string} The complete primary key for the cache.
 */
function getPrimaryKey(customKeyInput) {
  if (!customKeyInput) {
    return `${CACHE_PREFIX}${github.context.sha}`;
  }
  return `${CACHE_PREFIX}${customKeyInput.trim()}`;
}

/**
 * Constructs an array of restore keys based on user input and a default prefix.
 * @param {string} customRestoreKeysInput - Newline-separated string of custom restore keys.
 * @returns {string[]} An array of restore keys for the cache.
 */
function getRestoreKeys(customRestoreKeysInput) {
  const defaultRestoreKeys = [CACHE_PREFIX];
  if (!customRestoreKeysInput) {
    return defaultRestoreKeys;
  }
  const restoreKeys = customRestoreKeysInput
    .split(/[\r\n]/)
    .map((input) => input.trim())
    .filter((input) => input !== "")
    .map((input) => `${CACHE_PREFIX}${input}`);
  return restoreKeys;
}

/**
 * Restores the RPC cache using the provided keys.
 */
async function restoreRPCCache() {
  const customKeyInput = core.getInput("cache-key");
  const primaryKey = getPrimaryKey(customKeyInput);
  core.info(`Primary key: ${primaryKey}`);
  core.saveState(State.CachePrimaryKey, primaryKey);

  const customRestoreKeysInput = core.getInput("cache-restore-keys");
  const restoreKeys = getRestoreKeys(customRestoreKeysInput);
  core.info(`Restore keys: ${restoreKeys.join(", ")}`);
  const matchedKey = await cache.restoreCache(CACHE_PATHS, primaryKey, restoreKeys);

  if (!matchedKey) {
    core.info("Cache not found");
    return;
  }

  core.saveState(State.CacheMatchedKey, matchedKey);
  core.info(`Cache restored from key: ${matchedKey}`);
}

/**
 * Saves the RPC cache using the primary key saved in the state.
 * If the cache was already saved with the primary key, it will not save it again.
 */
async function saveCache() {
  const primaryKey = core.getState(State.CachePrimaryKey);
  const matchedKey = core.getState(State.CacheMatchedKey);

  // If the cache path does not exist, do not save the cache
  if (!fs.existsSync(CACHE_PATHS[0])) {
    core.info(`Cache path does not exist, not saving cache: ${CACHE_PATHS[0]}`);
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

  // If the cacheId is -1, the saving failed with an error message log. No additional logging is needed.
  if (cacheId === -1) {
    return;
  }

  core.info(`Cache saved with the key: ${primaryKey}`);
}

module.exports = {
  restoreRPCCache,
  saveCache,
};
