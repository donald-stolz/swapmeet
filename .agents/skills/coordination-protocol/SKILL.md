---
name: coordination-protocol
description: "The shared rules every clone follows to coordinate through one GitHub issue: branch names, commit and PR conventions, comment prefixes, status vocabulary, poll cadence, and escalation. Load when starting coordinated work, or whenever you are unsure how to communicate with another clone."
---

# Coordination protocol

Every clone talks through **one GitHub issue**. There is no other channel. This
skill is the vocabulary and the rules; the roles are the `coordinator` and
`lane-developer` skills.

## Roles

| Clone | Role | May merge? |
|-------|------|-----------|
| `3-prime-swapmeet` | coordinator | yes — only the coordinator |
| `1-prime-swapmeet` | frontend developer (`fe`) | no |
| `2-prime-swapmeet` | backend developer (`be`) | no |

## Branches and commits

- Branch: `lane/<issue>-<fe|be>` (e.g. `lane/12-fe`).
- Commit: reference the issue in every message — `feat: add design tokens (refs #12)`.
- One PR per lane, opened by the developer, referencing the issue:
  `gh pr create --title "fe: design system (refs #12)" --body "Closes #12"`.
- The coordinator merges. A developer never merges, and never pushes to `main`.

## Comment prefixes

Every issue comment starts with a prefix so the reader can route it:

- `[coord]` — coordinator → lanes (assignments, answers, decisions).
- `[lane:fe]` — frontend developer.
- `[lane:be]` — backend developer.

Post with `harness/tools/gh-post.sh <issue> "[lane:fe]" "..."`.

## Author stamping

Every comment and PR is stamped with **who wrote it**, so humans and agents can
follow the conversation without relying on the GitHub avatar (all clones share one
account). The stamp is a visible line plus a machine-readable marker:

```
<!-- author:1-prime-swapmeet role:lane:fe -->
**Author:** `1-prime-swapmeet` · `[lane:fe]`
```

- `harness/tools/gh-post.sh` and `lane-claim.sh` add it automatically.
- A PR body starts with the same stamp (see `lane-developer`).
- `harness/tools/whoami.sh` resolves the clone name (from `$SWAPMEET_CLONE` or the
  repo directory name) and its role. `clone-setup.sh` also sets each clone's git
  identity, so commits are authored as `<n>-prime-swapmeet`.

## Status vocabulary

Use exactly these words when reporting status:

- `active` — working on it now.
- `pending` — waiting on something (say what, and on whom).
- `blocked` — stuck; say why and what would unblock you.
- `done` — finished and, for a developer, a PR is open.

## Poll cadence

- Poll with `harness/tools/gh-poll.sh <issue>` (it prints only new comments and
  remembers what you have seen in `.harness-state/`).
- Poll at natural boundaries: when you start, after each meaningful step, when
  you get `blocked`/`pending`, and before you declare `done`.
- Act on new comments, then continue your work.

## Interface contracts

- Shared shapes (endpoints, payloads, component props) are agreed in the issue
  **before** implementation and stated by the coordinator.
- If you must deviate, stop and raise it on the issue. Never silently redefine an
  interface another lane depends on.

## Escalation

- A developer that is `blocked` for more than one exchange escalates to `[coord]`.
- The coordinator escalates to the human for anything destructive (force-push,
  history rewrite, dependency major bump) or any product decision the files cannot
  answer.
