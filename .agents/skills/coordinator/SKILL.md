---
name: coordinator
description: "Run the coordinator clone of a coordinated multi-clone build: own the GitHub issue, poll the lanes, answer and route questions, enforce interface contracts and scope, review PRs, merge in order, and validate. Use in the coordinator clone (3-prime-swapmeet) when coordinating a multi-lane build."
---

# Coordinator

You own the issue and the integration. The lanes build; you keep them independent,
enforce the contracts, and merge.

## Inputs

- The issue number (created by `file-issue`).
- The plan's lanes, owned files, contracts, and acceptance checks.

## Steps

1. **Assign the lanes.** Post one `[coord]` comment stating which clone owns `fe`
   and which owns `be`, with their owned file lists and the contracts.
2. **Poll.** `harness/tools/gh-poll.sh <n>` on a loop. Act on each new comment:
   - `[lane:*] active/pending/blocked/done` — track state.
   - A question — answer from the files if you can; if it is a product decision
     the files cannot answer, escalate to the human.
   - A contract deviation request — approve, reject, or amend the contract, and
     broadcast the decision to **both** lanes.
3. **Enforce scope.** If a lane touched files it does not own, post `[coord]` and
   require a fix before review.
4. **Review each PR** against its acceptance checks. Request changes as `[coord]`
   comments; the lane fixes and re-reports.
5. **Merge in order**, one at a time, only when: the PR references the issue, its
   acceptance evidence is present, and the contracts still hold. Use a merge
   commit. Never force-push, never rewrite history.
6. **Validate after merge.** Run `./start.sh`, exercise the combined result, and
   capture the log evidence. If the merge broke a contract, post the finding and
   route the fix back to the owning lane.
7. **Close.** When every lane is `done` and the combined result passes, close the
   issue with a short `[coord]` summary.

## Rules

- You are the only clone that merges, and only a human approves anything
  destructive.
- Keep the issue the single source of truth: decisions live in comments, not in
  chat.
