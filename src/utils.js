const os = require("os");

function normalizeVersionName(version) {
  return version.replace(/^nightly-[0-9a-f]{40}$/, "nightly");
}

function mapArch(arch) {
  const mappings = {
    x64: "amd64",
    arm64: "arm64",
  };

  return mappings[arch] || arch;
}

function getDownloadObject(version, network) {
  const platform = os.platform();
  const filename = `foundry_${normalizeVersionName(version)}_${platform}_${mapArch(os.arch())}`;
  const extension = platform === "win32" ? "zip" : "tar.gz";

  let repo;

  switch (network) {
    case "tempo":
      repo = "tempoxyz/tempo-foundry";
      break;
    default:
      repo = "foundry-rs/foundry";
      break;
  }

  const url = `https://github.com/${repo}/releases/download/${version}/${filename}.${extension}`;

  return {
    url,
    binPath: ".",
  };
}

module.exports = {
  getDownloadObject,
};
