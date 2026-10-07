#!/usr/bin/env bash
# Identify this clone so every comment and PR can be stamped with its author.
# Name resolution: $SWAPMEET_CLONE, else the repo directory name.
# Usage: whoami.sh [--name|--role|--stamp]
set -euo pipefail

name="${SWAPMEET_CLONE:-$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")}"

case "$name" in
  1-prime*|*-fe)  role="lane:fe" ;;
  2-prime*|*-be)  role="lane:be" ;;
  3-prime*|*-coord) role="coord" ;;
  *)              role="unknown" ;;
esac

case "${1:-}" in
  --name)  printf '%s\n' "$name" ;;
  --role)  printf '%s\n' "$role" ;;
  --stamp) printf 'Author: %s (%s)\n' "$name" "$role" ;;
  *)       printf '%s %s\n' "$name" "$role" ;;
esac
