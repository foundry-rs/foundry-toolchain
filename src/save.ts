import core from "@actions/core";

import { saveCache } from "./cache";

/**
 * Catch and log unhandled exceptions that can bubble up from chunked uploads.
 * We deliberately log as "info" with a `[warning]` prefix to avoid failing the action.
 */
process.on("uncaughtException", (e) => {
  const warningPrefix = "[warning]";
  core.info(`${warningPrefix}${e.message}`);
});

/**
 * Post step for saving cache.
 * @param {boolean} earlyExit When true, exit the process after handling to work around slow post-action steps.
 *                  See: https://github.com/actions/setup-node/issues/878
 */
export async function run(earlyExit: boolean = true): Promise<void> {
  try {
    const cacheInput = core.getBooleanInput("cache");
    if (cacheInput) {
      await saveCache();
    } else {
      core.info("Cache not requested, not saving cache");
    }

    if (earlyExit) {
      process.exit(0);
    }
  } catch (error) {
    let message = "Unknown error!";
    if (error instanceof Error) {
      message = error.message;
    }
    if (typeof error === "string") {
      message = error;
    }
    core.warning(message);
  }
}

export default run;

if (require.main === module) {
  run(true);
}
