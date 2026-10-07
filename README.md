# 🛒 SwapMeet

A local classifieds marketplace for people building something — sell your
espresso machine, buy a food-truck generator, start your lawn-care route.

This is the **teaching app** for the Harness Engineering curriculum. It ships
working-but-ugly on purpose: the landing page renders the raw JSON listings
payload. Making it a real marketplace is the work — delivered one feature at
a time by parallel agent lanes coordinated through GitHub Issues.

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

- **Server:** Node.js + Fastify (`server/`) — JSON file datastore, no database
- **Client:** React + Vite (`client/`)
- **Data:** `data/listings.json`

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

Open http://localhost:5173 — you should see the listing count and the raw
payload. Check the server terminal: every API request is logged.

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
| `GET /api/listings` | all listings |
| `GET /api/listings/:id` | one listing, or 404 |
