@AGENTS.md

## Claude Code notes

- The constitution is `AGENTS.md` (imported above). Edit it there, not here.
- Skills are discovered from `.claude/skills/`, which is a symlink to
  `.agents/skills/`. Author and edit skills at their real path,
  `.agents/skills/<name>/SKILL.md` — Claude's Edit tool refuses to write through
  the symlink and will point you at the target.
- A `PreToolUse` hook (`harness/tools/block-force-push.sh`) blocks `git push
  --force` / `-f`. The rule in the constitution still applies to every other CLI.
- The harness tools in `harness/tools/` are plain bash; run them directly.
