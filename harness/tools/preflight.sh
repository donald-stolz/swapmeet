#!/usr/bin/env bash
# Preflight for coordinated work: check the toolchain the harness depends on.
set -uo pipefail

fail=0
chk() { # chk <label> <command...>
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then
    printf 'ok   %s\n' "$label"
  else
    printf 'FAIL %s\n' "$label"
    fail=1
  fi
}

chk "git"            command -v git
chk "node"           command -v node
chk "node >= 20"     node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 20 ? 0 : 1)'
chk "gh installed"   command -v gh
chk "gh authenticated" gh auth status
chk "gh repo resolvable" gh repo view --json nameWithOwner

echo "---"
if [ "$fail" -eq 0 ]; then
  echo "preflight: PASS"
else
  echo "preflight: FAIL"
  exit 1
fi
