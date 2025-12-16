import * as core from "@actions/core";
import * as cache from "@actions/cache";
import * as github from "@actions/github";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const HOME = os.homedir();
const PLATFORM = os.platform();
const CACHE_PATHS = [path.join(HOME, ".foundry/cache/rpc")];
const CACHE_PREFIX = `${PLATFORM}-foundry-chain-fork-`;

const STATE_CACHE_PRIMARY_KEY = "CACHE_KEY";
const STATE_CACHE_MATCHED_KEY = "CACHE_RESULT";

function getPrimaryKey(customKeyInput: string): string {
  if (!customKeyInput) {
    return `${CACHE_PREFIX}${github.context.sha}`;
  }
  return `${CACHE_PREFIX}${customKeyInput.trim()}`;
}

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

export async function restoreRPCCache(): Promise<void> {
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

export async function saveCache(): Promise<void> {
  const primaryKey = core.getState(STATE_CACHE_PRIMARY_KEY);
  const matchedKey = core.getState(STATE_CACHE_MATCHED_KEY);

  if (!fs.existsSync(CACHE_PATHS[0])) {
    core.info(`Cache path does not exist, not saving cache: ${CACHE_PATHS[0]}`);
    return;
  }

  if (!primaryKey) {
    core.info("Primary key was not generated. Please check the log messages above for more errors or information");
    return;
  }

  if (primaryKey === matchedKey) {
    core.info(`Cache hit occurred on the primary key ${primaryKey}, not saving cache.`);
    return;
  }

  const cacheId = await cache.saveCache(CACHE_PATHS, primaryKey);

  if (cacheId === -1) {
    return;
  }

  core.info(`Cache saved with the key: ${primaryKey}`);
}
