import * as os from "os";

/**
 * Collapse nightly tags like `nightly-<commit-sha>` into just `nightly`.
 */
function normalizeNightlyTag(version: string) {
  return version.replace(/^nightly-[0-9a-f]{40}$/, "nightly");
}

function mapArch(arch: string) {
  const mappings: Record<string, string> = {
    x32: "386",
    x64: "amd64",
  };

  return mappings[arch] || arch;
}

export function getDownloadObject(version: string) {
  const platform = os.platform();
  const filename = `foundry_${normalizeNightlyTag(version)}_${platform}_${mapArch(os.arch())}`;
  const extension = platform === "win32" ? "zip" : "tar.gz";
  const url = `https://github.com/foundry-rs/foundry/releases/download/${version}/${filename}.${extension}`;

  return {
    url,
    binPath: ".",
  };
}
