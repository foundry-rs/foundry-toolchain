const os = require("os");


function mapArch(arch) {
  const mappings = {
    x32: "386",
    x64: "amd64",
  };

  return mappings[arch] || arch;
}

function getDownloadObject(version) {
  const platform = os.platform();
  const filename = `foundry_nightly_${platform}_${mapArch(os.arch())}`;
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
