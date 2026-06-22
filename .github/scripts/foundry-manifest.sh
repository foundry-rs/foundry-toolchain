#!/usr/bin/env bash
# Capture a normalized, comparable manifest of an installed Foundry toolchain.
#
# Used by the canary CI job to assert behavioral equivalence between the legacy bash
# `foundryup` and the Rust rewrite. We compare the *public contract* (each tool resolves
# under ~/.foundry/bin and reports the same --version), NOT the on-disk layout: the Rust
# rewrite intentionally changes internal layout (repo-scoped version dirs, symlinks instead
# of copied binaries), so an exact file-tree match is the wrong assertion.
#
# Usage: foundry-manifest.sh <output-file>
set -euo pipefail

out="$1"
: >"$out"

for tool in forge cast anvil chisel; do
  resolved="$(command -v "$tool" || true)"
  if [ -z "$resolved" ]; then
    echo "::error::$tool is not on PATH after install" >&2
    exit 1
  fi
  case "$resolved" in
  *.foundry/bin/*) : ;;
  *) echo "::warning::$tool resolved outside ~/.foundry/bin: $resolved" >&2 ;;
  esac

  # Record only the version output (the public contract). Two installs of the same Foundry
  # version produce byte-identical binaries, so this is stable across legacy vs Rust.
  echo "=== $tool ===" >>"$out"
  "$tool" --version >>"$out" 2>&1
done

# Diagnostic-only dump (printed to the log, never compared) to aid debugging layout changes.
{
  echo "--- DIAGNOSTIC: ~/.foundry/bin ---"
  ls -la "$HOME/.foundry/bin" 2>/dev/null || true
  echo "--- DIAGNOSTIC: ~/.foundry/versions (depth 4) ---"
  find "$HOME/.foundry/versions" -maxdepth 4 2>/dev/null || true
} >&2

echo "Wrote manifest to $out:" >&2
cat "$out" >&2
