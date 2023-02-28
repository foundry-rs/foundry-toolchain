require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 321:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const cache = __nccwpck_require__(454);
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

/***/ 353:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { saveCache } = __nccwpck_require__(321);

async function save() {
  await saveCache();
}

module.exports = save;

if (require.main === require.cache[eval('__filename')]) {
  save();
}


/***/ }),

/***/ 454:
/***/ ((module) => {

module.exports = eval("require")("@actions/cache");


/***/ }),

/***/ 177:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


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
/******/ 	var __webpack_exports__ = __nccwpck_require__(353);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map