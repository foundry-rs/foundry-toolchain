import * as core from "@actions/core";
import { saveCache } from "./cache.js";

process.on("uncaughtException", (e: Error) => {
  const warningPrefix = "[warning]";
  core.info(`${warningPrefix}${e.message}`);
});

async function run(earlyExit: boolean): Promise<void> {
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

run(true);
