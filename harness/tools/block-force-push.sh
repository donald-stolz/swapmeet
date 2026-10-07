#!/usr/bin/env bash
# Claude Code PreToolUse(Bash) hook: block force-pushes (destructive).
# Reads the hook JSON on stdin; exit code 2 blocks the tool call.
# The rule lives in AGENTS.md; this hook is Claude-only enforcement.
set -uo pipefail

input="$(cat)"

INPUT="$input" python3 - <<'PY'
import os, json, re, shlex, sys

try:
    data = json.loads(os.environ.get("INPUT") or "{}")
except Exception:
    sys.exit(0)

cmd = ""
if isinstance(data, dict):
    cmd = (data.get("tool_input") or {}).get("command", "") or data.get("command", "")
if not cmd:
    sys.exit(0)

FORCE = {"-f", "--force", "--force-with-lease"}

for segment in re.split(r"[;&|]", cmd):
    try:
        tokens = shlex.split(segment)
    except ValueError:
        tokens = segment.split()
    if "git" not in tokens:
        continue
    rest = tokens[tokens.index("git") + 1:]
    if "push" not in rest:
        continue
    for tok in rest[rest.index("push") + 1:]:
        if tok.startswith("-") and tok.split("=", 1)[0] in FORCE:
            sys.stderr.write(
                "Blocked: force-push is a destructive action. "
                "Get explicit human approval first (AGENTS.md rule 5).\n"
            )
            sys.exit(2)

sys.exit(0)
PY
