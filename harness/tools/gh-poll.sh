#!/usr/bin/env bash
# Poll a coordinating issue for comments you have not seen yet.
# Usage: gh-poll.sh <issue> [--all]
#   (no flag) prints only new comments since the last poll
#   --all     prints every comment
# Seen comment ids are kept in .harness-state/issue-<n>.seen (gitignored).
set -euo pipefail

issue="${1:?usage: gh-poll.sh <issue> [--all]}"
mode="${2:-}"

repo="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
mkdir -p .harness-state
seen=".harness-state/issue-${issue}.seen"
[ -f "$seen" ] || : > "$seen"

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

gh api "repos/${repo}/issues/${issue}/comments" --paginate \
  --jq '.[] | [(.id|tostring), .created_at, .user.login, (.body|gsub("\n"; " "))] | @tsv' > "$tmp"

if [ "$mode" = "--all" ]; then
  cat "$tmp"
elif [ -s "$tmp" ]; then
  awk -F'\t' 'NR==FNR { seen[$1]=1; next } !($1 in seen) { print }' "$seen" "$tmp"
fi

# Record everything seen so the next poll only shows newer comments.
cut -f1 "$tmp" | sort -u > "$seen"
