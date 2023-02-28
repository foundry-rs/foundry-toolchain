require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 321:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const cache = __nccwpck_require__(190);
const github = __nccwpck_require__(177);
const fs = __nccwpck_require__(147);
const os = __nccwpck_require__(37);
const path = __nccwpck_require__(17);

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


/***/ }),

/***/ 168:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(450);
const toolCache = __nccwpck_require__(454);
const path = __nccwpck_require__(17);

const { restoreRPCCache } = __nccwpck_require__(321);
const { getDownloadObject } = __nccwpck_require__(123);

async function main() {
  try {
    // Get version input
    const version = core.getInput("version");

    // Download the archive containing the binaries
    const download = getDownloadObject(version);
    console.log(`Downloading Foundry '${version}' from: ${download.url}`);
    const pathToArchive = await toolCache.downloadTool(download.url);

    // Extract the archive onto host runner
    console.log(`Extracting ${pathToArchive}`);
    const extract = download.url.endsWith(".zip") ? toolCache.extractZip : toolCache.extractTar;
    const pathToCLI = await extract(pathToArchive);

    // Expose the tool
    core.addPath(path.join(pathToCLI, download.binPath));

    // Get cache input
    const cache = core.getInput("cache");

    if (cache) {
      // Restore the RPC cache, if any.
      restoreRPCCache();
    }
  } catch (err) {
    core.setFailed(err);
  }
}

module.exports = main;

if (require.main === require.cache[eval('__filename')]) {
  main();
}


/***/ }),

/***/ 123:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const os = __nccwpck_require__(37);

function normalizeVersionName(version) {
  return version.replace(/^nightly-[0-9a-f]{40}$/, "nightly");
}

function mapArch(arch) {
  const mappings = {
    x32: "386",
    x64: "amd64",
  };

  return mappings[arch] || arch;
}

function getDownloadObject(version) {
  const platform = os.platform();
  const filename = `foundry_${normalizeVersionName(version)}_${platform}_${mapArch(os.arch())}`;
  const extension = platform === "win32" ? "zip" : "tar.gz";
  const url = `https://github.com/foundry-rs/foundry/releases/download/${version}/${filename}.${extension}`;

  return {
    url,
    binPath: ".",
  };
}

module.exports = {
  getDownloadObject,
};


/***/ }),

/***/ 190:
/***/ ((module) => {

module.exports = eval("require")("@actions/cache");


/***/ }),

/***/ 450:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 177:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 454:
/***/ ((module) => {

module.exports = eval("require")("@actions/tool-cache");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 37:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(168);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map