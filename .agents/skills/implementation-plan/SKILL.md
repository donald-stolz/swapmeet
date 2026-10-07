---
name: implementation-plan
description: "Turn a design hand-off or feature spec into a written implementation plan with parallel lanes, owned files, interface contracts, and an acceptance checklist — the input to file-issue. Use when the team receives a design system or spec and must decompose it before any code is written."
---

# Implementation plan

Produce a plan, not code. The plan is the input to `file-issue`.

## Inputs

- The design hand-off / spec (e.g. a design-system folder, a requirements doc).
- The repo as it is now: `README.md`, `product-requirements.md`, `server/`,
  `client/`, and `./start.sh`.
- The MVP scope, if one is written down.

## Steps

1. **Read the hand-off and the repo.** List what the hand-off delivers (tokens,
   components, icons, theming) and where each piece lands in the repo.
2. **Decide the lanes.** Default to two:
   - `fe` — the frontend lane: bring the design system into `client/` and apply it.
   - `be` — the backend lane: whatever the server must expose for the new UI.
   If the work is single-sided, say so and use one lane.
3. **Assign owned files per lane.** Be explicit and exhaustive: each lane owns a
   concrete file list. No file is owned by two lanes.
4. **Write the interface contracts.** For every boundary between lanes, state the
   exact shape (endpoint + method + request/response, or component props). This is
   what keeps the lanes independent.
5. **List the acceptance checks.** Per lane, the observable evidence that proves
   it works (a log line, a curl, a rendered page). No "done" without evidence.
6. **Write the plan** as a markdown document with these headings:
   `## Goal`, `## Lanes` (owned files per lane), `## Contracts`,
   `## Acceptance`, `## Risks`.

## Output

A single markdown file (`plan.md` or an issue body) in exactly the shape above,
ready to hand to `file-issue`. Do not write application code in this skill.
