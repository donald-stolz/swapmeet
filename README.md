# 🛒 SwapMeet

A local classifieds marketplace for people building something — sell your
espresso machine, buy a food-truck generator, start your lawn-care route.

This is the **teaching app** for the Harness Engineering curriculum. MVP v0.01
(issue #1) is the core loop: browse listings as a card grid, filter by
category, open a listing, and post a new one. It is styled with the received
design system and has a Day/Night theme. Each feature is delivered by parallel
agent lanes coordinated through GitHub Issues.

## Meet Johnny8

<img src="assets/johnny8.png" alt="Johnny8" width="120" align="left" />

**Johnny8** is SwapMeet's staff engineer agent — an Octonion, from the
Megalith: a place that lies at the event horizon where humans and octonions
work together ([octonions.ai](https://octonions.ai)).

When you open Claude Code in this repo, the agent takes on the Johnny8 role:
a senior engineering pair that greets you with *"Strength and honor,"* holds
the line on the guards, and never claims something works without log
evidence. You drive; Johnny8 builds, flags risks, and pushes back when
something smells wrong.

<br clear="left" />

## Stack

- **Server:** TypeScript + Fastify (`server/src/`), run with `tsx`. JSON file
  datastore, no database.
- **Client:** TypeScript + React + Vite + Tailwind v4 (`client/src/`). Styling
  uses design-system tokens only; the hand-off lives verbatim in
  `client/src/design-system/`.
- **Data:** `data/listings.json` — `POST /api/listings` writes to it at runtime.

## Layout

```
server/src/
  server.ts       routes, logging, static serving of client/dist
  store.ts        loadListings(), appendListing() — serialized, atomic writes
  validate.ts     NewListing validation, returns per-field errors
  types.ts        Listing, Category, NewListing
client/src/
  App.tsx         layout shell + hash router (#/, #/listings/:id, #/sell)
  api/            types.ts (contract types), client.ts (the only fetch caller)
  pages/          BrowsePage, ListingPage, SellPage
  components/     Header, ThemeToggle, CategoryFilter
  lib/format.ts   price, condition, category and date formatting
  design-system/  hand-off tokens + components, copied verbatim — do not edit
```

## Quickstart

```bash
./start.sh      # installs deps if needed, then server on :3001 + client on :5173
```

`start.sh` is the single entry point: it checks Node 20+, installs
workspace deps on first run, refuses to start if a port is taken (and names
the process holding it), raises the open-file limit for Vite's watcher, and
only prints `READY` after both ends answer over HTTP. Ctrl-C stops both.

Override ports with `SERVER_PORT=3002 CLIENT_PORT=5174 ./start.sh`.
Under the hood it runs the same npm scripts, which still work on their own:

```bash
npm install     # once, from the repo root (npm workspaces)
npm run dev     # server on :3001, client on :5173
```

Open http://localhost:5173 to see the listing grid. Check the server terminal:
every API request is logged.

Type-check either side with `npm run typecheck -w server` or
`npm run typecheck -w client`.

Production check:

```bash
./start.sh prod # builds client into client/dist, Fastify serves API + UI on :3001
```

(equivalent to `npm run build && npm start`)

## How this repo is used in the curriculum

1. **Clone** this repo.
2. **Pull in the guards** — `guards/core.md` and `guards/basic.md` are the
   sanitized harness rules every agent loads (referenced from `CLAUDE.md`).
3. **Start the project** — run it, watch the logs, understand the baseline.
4. **Plan Mode** — decompose the first feature into parallel lanes.
5. **Coordinate via GitHub Issues** — one Issue per lane: scope, owned files,
   interface contract.
6. **Execute** — parallel Claude Code sessions, one per lane clone.
7. **PR** — each lane delivers through a pull request linked to its Issue.
8. **Merge** — integrate, validate through logs, ship.

Steps 1–3 are the week-one project; steps 4–8 are the parallel-lanes projects
that follow.

## API

| Endpoint | Returns |
|----------|---------|
| `GET /api/health` | `{ status: "ok" }` |
| `GET /api/listings` | all listings, newest `postedAt` first |
| `GET /api/listings?category=<slug>` | listings in that category; `[]` if none |
| `GET /api/listings/:id` | one listing, or 404 |
| `GET /api/categories` | `{ slug, count }[]`, sorted by slug, derived from the data |
| `POST /api/listings` | `201` with the created listing, or `400 { error, fields }` |

The shapes and validation rules are the contracts in issue #1.

Running a `POST` (by hand or in a test) changes `data/listings.json`. Restore
the seed data before committing: `git checkout data/listings.json`.
