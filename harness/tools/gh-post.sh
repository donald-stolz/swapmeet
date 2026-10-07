#!/usr/bin/env bash
# Post a stamped comment to the coordinating issue.
# Usage: gh-post.sh <issue> <prefix> <message...>
#   prefix is one of: "[coord]" "[lane:fe]" "[lane:be]"
# Every comment carries an Author stamp so humans and agents know who is speaking.
set -euo pipefail

issue="${1:?usage: gh-post.sh <issue> <prefix> <message>}"
prefix="${2:?usage: gh-post.sh <issue> <prefix> <message>}"
shift 2
message="${*:?message required}"

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
name="$("$here/whoami.sh" --name)"
role="$("$here/whoami.sh" --role)"

body="<!-- author:${name} role:${role} -->
**Author:** \`${name}\` · \`${prefix}\`

${message}"

gh issue comment "$issue" --body "$body"
echo "posted to #${issue} as ${name} (${prefix}): ${message}"
