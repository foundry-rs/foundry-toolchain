import * as os from "os";

/**
 * Type representing a download object with URL and binary path.
 */
type Download = {
  url: string;
  binPath: string;
};

/**
 * Collapse nightly tags like `nightly-<commit-sha>` into just `nightly`.
 * @param version The version string to normalize.
 * @return The normalized version string.
 */
function normalizeNightlyTag(version: string): string {
  return version.replace(/^nightly-[0-9a-f]{40}$/, "nightly");
}

/**
 * Map Node.js `os.arch()` values to Foundry's expected architecture strings.
 * @param arch The architecture string from `os.arch()`.
 * @returns The normalized architecture string.
 */
function normalizeArch(arch: string): string {
  const mappings: Record<string, string> = {
    x32: "386",
    x64: "amd64",
  };

  return mappings[arch] || arch;
}

export function getDownloadObject(version: string): Download {
  const platform = os.platform();
  const filename = `foundry_${normalizeNightlyTag(version)}_${platform}_${normalizeArch(os.arch())}`;
  const extension = platform === "win32" ? "zip" : "tar.gz";
  const url = `https://github.com/foundry-rs/foundry/releases/download/${version}/${filename}.${extension}`;

  return {
    url,
    binPath: ".",
  };
}
