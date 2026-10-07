# SwapMeet — Product Requirements

> Synthesized from the team's "Discovered Product Requirements" board (FigJam),
> then extended with the build strategy for the factory. This is the product
> source of truth, and the context the factory build reads.

## What it is

SwapMeet is a local, trusted marketplace for buying and selling second-hand goods
within a community. It makes thrifting and selling easy from anywhere, keeps
transactions local, and uses AI to remove the tedious parts of reselling — listing,
pricing, and negotiating.

## Tech stack

- **Client** — React + Vite, **TypeScript**.
- **Styling** — **Tailwind CSS** driven by a **token-based design system**: every
  color, type step, space, and shape is a token, and components use only tokens.
  No hard-coded values.
- **Server** — Node + Fastify, **TypeScript**, JSON datastore (`data/listings.json`).
- **Theming** — Day / Night, from the design system tokens.

## The design system (token-based)

The product is styled by the received hand-off in `design/swapmeet-design-system/`.
It is token-first: `tokens.json` is the source of truth, `tokens.css` compiles it to
CSS variables (with Day/Night theming), and the components (`Button`, `Badge`,
`ItemCard`, `Icon`) read only those variables. A new color or size is a token first,
a class second.

## How do we add value to the online community market?

We add value by being a **trusted platform for individuals to thrift within their
local communities**. Transactions stay local, inside a trusted community, and AI
helps with the difficult tasks — pricing and negotiating.

The gap it fills: today's options are broken. General marketplaces have no trust
(sell to anyone, no seller history, awkward shipping), and social marketplaces are
a mess for trust and profiles. SwapMeet adds a **trust-and-reputation layer** and
**removes the tedious parts of listing, pricing, and managing inventory**, so
selling lives in one place instead of six listings across six platforms. It should
also let people see the impact of reuse in real terms — shopping that feels good,
not something you have to justify.

## What features do we want?

The full ambition, grouped from the board:

**Listing & selling**
- AI-assisted listing: photo recognition, pricing suggestions, description
  drafting and posting, and product-detail recommendations.
- Buy / offer / swap.

**Pricing & negotiating**
- AI-powered pricing and negotiating: suggest a price range, adjust for condition
  and demand, and negotiate with buyers within seller-set rules.
- Bid / auction.

**Trust & payments**
- Trust & reputation: reviews, ratings, verified earnings.
- Integrated payments: escrow, payouts, refunds, condition guarantees.

**Discovery & community**
- Local discovery: map and proximity, local pickup.
- Recommendation engine / product finds.
- On-platform messaging: filters, offers, counter-offers, scheduling.
- Community: followers, social profiles, small businesses and creators.
- Transaction history, favorites, saved searches.
- Photo/video and item condition.

## Build strategy — frontend-first with mocks, backend core MVP

We do **not** build all of the above for real. We build the **frontend broadly with
mocked functionality** so the team can experience the product and learn what works
and what doesn't, and we build only the **core backend** the main loop needs.

### Frontend — most of the product, built out with mocks

Build the whole experience with the design system, and **stub or mock every feature
that would need a real server or a third party**, behind a clear interface so it can
be swapped for a real API later:

- **Real UI (core loop):** listings grid, category filter, listing detail,
  post-a-listing form — using the design system components.
- **Mocked:** AI-assisted listing, AI pricing & negotiating, offers/bids,
  messaging, trust & reputation, recommendation strip, local discovery/map,
  community. Mocked data, deterministic, no external calls.
- **Theming:** Day/Night.

Goal: let the team feel the whole product end to end and discover which ideas work
before anyone pays to build them.

### Backend — the core MVP, real

Build only the endpoints the core loop needs, each with log evidence:

- `GET /api/listings` — all listings
- `GET /api/listings?category=` — filter by category
- `GET /api/listings/:id` — one listing (404 if unknown)
- `GET /api/categories` — the category list the filter uses
- `POST /api/listings` — create a listing (validated, persisted to `data/listings.json`)

Everything else stays mocked on the frontend.

### MVP v0.01 — the smallest loop

A real buyer and seller can complete this end to end:

- Browse listings as a card grid, filter by category
- Open a listing detail page
- Post a listing through a form (validated, persisted)

## Who are our users/customers?

Three groups, but **MVP focuses on just the shopper/seller experience**:

- **Shoppers** — thrifters and budget-conscious, sustainability-focused,
  deal-seekers, people who need an item now.
- **Sellers** — individuals decluttering, side-hustlers, small businesses, people
  monetizing unused goods.
- **Businesses** — retail, nonprofit, and small-business inventory surplus (thrift
  stores, consignment shops, and other resellers).

Our users enjoy second-hand shopping and prioritize local/community businesses
and/or environmental and sustainability projects.

## Why do we want to build this?

To build a **local, connected resale economy** where reusing goods is the easy, fun
default choice — showcasing communities and culture, and highlighting what makes
them special and unique. It is personal: we are thrifters ourselves and want the
best place to thrift in your community, built by people who care about it.

## Will we love the product when we are done?

Yes. We'll get to see awesome communities, and we'll have a meaningful impact on the
environment and on communities.
