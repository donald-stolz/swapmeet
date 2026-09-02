# Listings Page v1 — Implementation Decomposition

## Overview

The landing page currently renders the raw `/api/listings` JSON payload in a
`<pre>` tag (an explicit "v0" placeholder — see the comment in
`client/src/App.jsx`). This decomposition turns it into a real Listings Page
v1: a card grid with a category filter bar. `data/listings.json` already has
a `category` field on every listing, so this is purely an API + UI feature —
no data migration needed.

Work splits into two lanes with **no shared files** and a **fixed API
contract** agreed up front, so both lanes can be built in parallel with zero
coordination beyond the contract below.

## API Contract

Fixed before either lane starts. Neither lane may silently redefine paths,
params, or response shapes — raise it on the Issue instead.

### `GET /api/listings?category=<slug>` (extends the existing endpoint)

- New optional query param `category` — exact string match against a
  listing's `category` field.
- Omitted → full array, current behavior unchanged.
- Present but no matches → `200 OK`, body `[]` (never 404 — this is a
  filtered *collection*; "no results" is a valid successful state, unlike
  the single-resource `:id` route, which correctly 404s).
- Response shape otherwise unchanged: bare array of listing objects.

Example:
```
GET /api/listings?category=maker-tools
```
```json
[
  { "id": "lst-003", "title": "Vinyl cutter + heat press bundle", "price": 620,
    "category": "maker-tools", "condition": "used-good", "emoji": "🎽",
    "description": "Cricut Venture plus 15x15 heat press. Started a t-shirt side business, pivoting to embroidery. Includes leftover vinyl rolls.",
    "seller": "Dee", "location": "Northgate", "postedAt": "2026-07-30" },
  { "id": "lst-006", "title": "Industrial sewing machine — Juki DDL-8700", "price": 550,
    "category": "maker-tools", "condition": "used-good", "emoji": "🧵",
    "description": "Workhorse straight-stitch machine with table and servo motor. Ideal for an alterations or upholstery business.",
    "seller": "Ana's Alterations", "location": "Old Town", "postedAt": "2026-08-01" }
]
```

Example (no matches):
```
GET /api/listings?category=bogus
```
```json
[]
```

### `GET /api/categories` (new endpoint)

Array of `{ slug, count }`, sorted alphabetically by `slug`, **derived live**
from `data/listings.json` — never hardcoded, so a new category in the data
works with zero code changes on either lane.

- `slug`: exact string to pass back into `?category=`.
- `count`: total listings in that category, globally (not affected by the
  client's currently-selected filter) — lets the filter bar show e.g.
  "Maker Tools (2)".
- No "All" entry — that's a client-side UI concept (equivalent to no
  param), not a real value of the `category` field.

Example:
```
GET /api/categories
```
```json
[
  { "slug": "events", "count": 1 },
  { "slug": "landscaping", "count": 1 },
  { "slug": "maker-tools", "count": 2 },
  { "slug": "restaurant-equipment", "count": 3 },
  { "slug": "retail", "count": 1 }
]
```

No new dependencies on either side — Fastify parses `request.query`
natively; categories are derived with plain-JS `reduce`/`Map`.

## Lane 1 — Server

**Scope:** add category filtering to `GET /api/listings` and a new
`GET /api/categories` endpoint, both derived live from
`data/listings.json`.

**Owned files (exclusive):**
- `server/server.js` — the only file this lane touches.

**Must not touch:** anything under `client/`, `data/`, `AGENTS.md`.

**Changes:**
1. In the existing `GET /api/listings` handler: read
   `request.query.category`, filter the loaded array when present, extend
   the existing `request.log.info(...)` call to include the filter and
   result count (e.g. `{ count, category: category ?? null }`).
2. Add `GET /api/categories`: load listings, count by `category` into a
   `Map`, convert to `[{ slug, count }]`, sort by `slug`, log
   `{ categories: result.length }`. Place it alongside the other
   `/api/listings*` routes, before static-file registration.
3. No other lines touched — `loadListings()`, static serving, listen logic
   stay as-is. No `server/package.json` changes.

**Validation commands:**
```bash
npm run dev -w server
curl -s http://localhost:3001/api/listings | jq length                      # expect 8
curl -s http://localhost:3001/api/listings?category=maker-tools | jq length # expect 2
curl -s http://localhost:3001/api/listings?category=bogus | jq .            # expect []
curl -s http://localhost:3001/api/categories | jq .                         # expect 5 entries, alphabetical, counts sum to 8
```
Confirm each call also appears in the Fastify request log with the expected
`category`/`count` fields — curl exit codes alone aren't sufficient
(log-driven validation).

## Lane 2 — Client

**Scope:** replace the raw JSON dump with a card grid and category filter
bar, wired to the two endpoints above.

**Owned files (exclusive):**
- `client/src/App.jsx` — rewritten to pure orchestration.
- `client/src/ListingCard.jsx` — new, presentational.
- `client/src/CategoryFilterBar.jsx` — new, presentational.
- `client/src/App.css` — new plain CSS file.

**Must not touch:** `client/src/main.jsx`, `client/package.json`, anything
under `server/`, `data/`.

**Changes:**
- `App.jsx` state: `listings`, `categories`, `selectedCategory` (`null` =
  "All"), `loading`, `error`.
  - On mount: fetch `/api/categories` once, and `/api/listings`
    (unfiltered).
  - On category click: refetch `/api/listings?category=<slug>` (or
    `/api/listings` for "All"); `categories` list stays untouched.
  - Reuse the current fetch/error pattern from the existing `App.jsx`.
  - Failure handling: non-200 on either fetch → error state (don't let one
    failed fetch silently swallow the other); empty `[]` filtered result →
    render "No listings in this category" rather than a blank grid.
- `ListingCard.jsx`: props `{ listing }`, renders emoji, title, formatted
  price, category, condition, seller, location. No fetch logic.
- `CategoryFilterBar.jsx`: props `{ categories, selected, onSelect }`,
  renders "All" + one button per category, highlights active selection.
- `App.css`: grid + card + filter bar styling, imported once from
  `App.jsx`. This is the one deliberate pattern shift from the current
  all-inline-styles approach — justified because a repeated card grid is
  exactly where inline `style={{}}` stops scaling; still zero new
  libraries or build tooling.

**Validation commands:**
```bash
npm run dev            # from repo root — starts server + client together
```
Then in a browser at `http://localhost:5173`:
- Confirm the grid renders 8 cards and the filter bar shows 5 category
  buttons with counts.
- Click each category: grid shows only matching cards; click "All":
  full grid returns.
- Open devtools Network tab: confirm `/api/categories` and each
  `/api/listings[?category=...]` call returns `200` with a shape matching
  the contract exactly.

## Coordination Rules

- Both lanes can start immediately and in parallel — the API contract above
  is everything Lane 2 needs to build against Lane 1's not-yet-written code
  (mock the two responses, or point at Lane 1's running dev server once
  it's up).
- Each commit references its Issue number (e.g.
  `feat: add category filter (refs #N)`) and must leave the app runnable.
- If either lane finds the contract doesn't actually fit (wrong shape,
  missing field), stop and raise it on the Issue — never silently change an
  endpoint path or response shape and let the other lane discover it later.
- Cross-lane needs (e.g. the client wants a field the contract doesn't
  have) go through the Issue, never through an out-of-scope edit into the
  other lane's files.
- `data/listings.json` is read-only for both lanes.
- The `AGENTS.md` "Module boundaries" section update (recording this file
  split) is a separate, small commit outside both lanes' scope — done by
  whichever lane finishes first, or as a third pass — since it touches
  neither lane's owned files.

## Integrated Verification (after both lanes merge)

- `npm run dev` from repo root, one terminal showing both server and client
  logs interleaved. Exercise every category + "All" in the browser while
  watching for a matching logged request per click.
- `npm run build && node server/server.js` — confirm the feature still
  works served statically from `client/dist`, not just under the Vite dev
  proxy (the "app must stay runnable" check applied to the integrated
  whole).
