import * as core from "@actions/core";
import * as cache from "@actions/cache";
import * as github from "@actions/github";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// Define constants for cache paths and prefix.
const HOME = os.homedir();
const PLATFORM = os.platform();
const CACHE_PATHS = [path.join(HOME, ".foundry/cache")];
const CACHE_PREFIX = `${PLATFORM}-foundry-chain-fork-`;

const STATE_CACHE_PRIMARY_KEY = "CACHE_KEY";
const STATE_CACHE_MATCHED_KEY = "CACHE_RESULT";

/**
 * Constructs the primary key for the cache using a custom key input.
 * @param customKeyInput - The custom part of the key provided by the user.
 * @returns The complete primary key for the cache.
 */
function getPrimaryKey(customKeyInput: string): string {
  if (!customKeyInput) {
    return `${CACHE_PREFIX}${github.context.sha}`;
  }
  return `${CACHE_PREFIX}${customKeyInput.trim()}`;
}

/**
 * Constructs an array of restore keys based on user input and a default prefix.
 * @param customRestoreKeysInput - Newline-separated string of custom restore keys.
 * @returns An array of restore keys for the cache.
 */
function getRestoreKeys(customRestoreKeysInput: string): string[] {
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

/** Restores the cache using the provided keys. */
export async function restoreCache(): Promise<void> {
  const customKeyInput = core.getInput("cache-key");
  const primaryKey = getPrimaryKey(customKeyInput);
  core.info(`Primary key: ${primaryKey}`);
  core.saveState(STATE_CACHE_PRIMARY_KEY, primaryKey);

  const customRestoreKeysInput = core.getInput("cache-restore-keys");
  const restoreKeys = getRestoreKeys(customRestoreKeysInput);
  core.info(`Restore keys: ${restoreKeys.join(", ")}`);
  const matchedKey = await cache.restoreCache(CACHE_PATHS, primaryKey, restoreKeys);

  if (!matchedKey) {
    core.info("Cache not found");
    return;
  }

  core.saveState(STATE_CACHE_MATCHED_KEY, matchedKey);
  core.info(`Cache restored from key: ${matchedKey}`);
}

/**
 * Saves the cache using the primary key saved in the state.
 * If the cache was already saved with the primary key, it will not save it again.
 */
export async function saveCache(): Promise<void> {
  const primaryKey = core.getState(STATE_CACHE_PRIMARY_KEY);
  const matchedKey = core.getState(STATE_CACHE_MATCHED_KEY);

  // If the cache path does not exist, do not save the cache.
  if (!fs.existsSync(CACHE_PATHS[0])) {
    core.info(`Cache path does not exist, not saving cache: ${CACHE_PATHS[0]}`);
    return;
  }

  // If the primary key is not generated, do not save the cache.
  if (!primaryKey) {
    core.info("Primary key was not generated. Please check the log messages above for more errors or information");
    return;
  }

  // If the primary key and the matched key are the same, this means the cache was already saved.
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
