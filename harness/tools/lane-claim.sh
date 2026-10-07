#!/usr/bin/env bash
# Announce a lane assignment on the coordinating issue (stamped).
# Usage: lane-claim.sh <issue> <lane> <clone>
#   lane: fe | be        clone: 1-prime-swapmeet | 2-prime-swapmeet
set -euo pipefail

issue="${1:?usage: lane-claim.sh <issue> <lane> <clone>}"
lane="${2:?usage: lane-claim.sh <issue> <lane> <clone>}"
clone="${3:?usage: lane-claim.sh <issue> <lane> <clone>}"

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
name="$("$here/whoami.sh" --name)"
role="$("$here/whoami.sh" --role)"

body="<!-- author:${name} role:${role} -->
**Author:** \`${name}\` · \`[coord]\`

lane ${lane} -> ${clone}"

gh issue comment "$issue" --body "$body"
echo "assigned lane ${lane} to ${clone} on #${issue} (as ${name})"
