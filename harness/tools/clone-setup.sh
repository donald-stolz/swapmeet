#!/usr/bin/env bash
# Create the three lane clones next to this repo, each with its own git identity
# so commits and PRs are attributable to the clone that made them.
# Usage: clone-setup.sh [base-dir]   (default: the repo's parent directory)
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
base="${1:-$(dirname "$repo_root")}"
origin="$(git -C "$repo_root" remote get-url origin)"

for n in 1 2 3; do
  dest="${base}/${n}-prime-swapmeet"
  if [ -d "$dest/.git" ]; then
    echo "exists: ${dest}"
  else
    git clone "$origin" "$dest"
    echo "cloned: ${dest}"
  fi
  # Stamp this clone's identity on its commits.
  git -C "$dest" config user.name "${n}-prime-swapmeet"
  git -C "$dest" config user.email "${n}-prime-swapmeet@swapmeet.local"
done

echo "roles: 1=frontend (lane:fe), 2=backend (lane:be), 3=coordinator"
echo "each clone commits as <n>-prime-swapmeet"
