#!/usr/bin/env bash
# Create the coordinating GitHub issue.
# Usage: new-issue.sh <title> <body-file> [label...]
set -euo pipefail

title="${1:?usage: new-issue.sh <title> <body-file> [label...]}"
body_file="${2:?usage: new-issue.sh <title> <body-file> [label...]}"
shift 2

[ -f "$body_file" ] || { echo "body file not found: $body_file" >&2; exit 1; }

args=(issue create --title "$title" --body-file "$body_file")
for label in "$@"; do
  args+=(--label "$label")
done

gh "${args[@]}"
