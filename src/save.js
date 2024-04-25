const { saveCache } = require("./cache.js");
const core = require("@actions/core");

// Catch and log any unhandled exceptions.  These exceptions can leak out of the uploadChunk method in
// @actions/toolkit when a failed upload closes the file descriptor causing any in-process reads to
// throw an uncaught exception.  Instead of failing this action, just warn.
process.on("uncaughtException", (e) => {
  const warningPrefix = "[warning]";
  core.info(`${warningPrefix}${e.message}`);
});

// Added early exit to resolve issue with slow post action step:
// - https://github.com/actions/setup-node/issues/878
// https://github.com/actions/cache/pull/1217
async function run(earlyExit) {
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

if (require.main === module) {
  run(true);
}
