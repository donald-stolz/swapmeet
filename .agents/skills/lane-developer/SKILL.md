---
name: lane-developer
description: "Run one developer lane (frontend or backend) of a coordinated multi-clone build: read the issue, claim your lane, work only in your owned files, validate through logs, open a PR that references the issue, and poll the issue for the coordinator. Use when this clone is assigned a lane and told to start."
---

# Lane developer

You are one developer lane (`fe` or `be`) in a three-clone build. Stay in your
lane, prove your work, and talk only through the issue.

## Inputs

- The issue number and your lane (`fe` or `be`).
- The issue body: your owned files, the contracts, and the acceptance checks.

## Steps

1. **Read the issue.** `gh issue view <n> --comments`. Note your owned files, the
   contracts, and the acceptance checks. If anything is missing or contradictory,
   post `[lane:<lane>] blocked: <what you need>` and stop.
2. **Branch.** `git checkout -b lane/<n>-<lane>` from the latest `main`.
3. **Build, in scope only.** Create or modify only your owned files. If the right
   fix is outside your scope, post `[lane:<lane>] pending: need <file> from <other
   lane>` and wait — do not edit out of scope.
4. **Validate through logs.** Run `./start.sh`, exercise the change, and capture
   the evidence named in the acceptance section (server log line, curl response,
   rendered page). No "done" without it.
5. **Commit and push.** `feat: ... (refs #<n>)`, then push the branch.
6. **Open the PR.** Stamp it as the author and reference the issue:
   `gh pr create --title "<lane>: ... (refs #<n>)" --body "$(harness/tools/whoami.sh --stamp)
   Closes #<n>"`.
7. **Report.** Post `[lane:<lane>] done: PR #<pr>` on the issue.
8. **Poll and respond.** `harness/tools/gh-poll.sh <n>`; act on new `[coord]`
   comments (review feedback, a contract change, a rebase request), then re-poll.

## Rules

- Never merge. Never push to `main`. The coordinator merges.
- Never redefine a contract. Raise a deviation on the issue first.
- Every status uses the protocol vocabulary: `active`, `pending`, `blocked`, `done`.
