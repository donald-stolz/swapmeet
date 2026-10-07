---
name: file-issue
description: "Create the GitHub issue that coordinates the lanes from an implementation plan: title, lane scopes, interface contracts, acceptance, and the coordination protocol. Use after implementation-plan, or when the user says 'open the issue' or 'file the work'."
---

# File the coordinating issue

Turn the plan from `implementation-plan` into the one GitHub issue every clone
works from.

## Steps

1. **Confirm the plan.** Read the plan (or take it as input). If the lanes or
   contracts are missing, run `implementation-plan` first.
2. **Check the repo.** `harness/tools/preflight.sh` must pass (`gh` authenticated).
3. **Write the issue body** to a temp file, with these sections:
   - `## Goal`
   - `## Lanes` — for each lane: the clone that owns it, and its owned file list.
   - `## Contracts` — the agreed interface shapes.
   - `## Acceptance` — the evidence required per lane.
   - `## Protocol` — one line: "Coordinate here. Prefix comments `[coord]`,
     `[lane:fe]`, `[lane:be]`. Poll with `harness/tools/gh-poll.sh <issue>`.
     Only the coordinator merges."
4. **Create it** with the tool:
   `harness/tools/new-issue.sh "<title>" <body-file> [labels...]`
5. **Report the number** and post the lane assignments as the first `[coord]`
   comment if the body did not already state them.

## Output

The issue URL and number, echoed back. Hand the number to each lane.
