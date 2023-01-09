const { saveCache } = require("./cache.js");

async function save() {
  await saveCache();
}

module.exports = save;

if (require.main === module) {
  save();
}
