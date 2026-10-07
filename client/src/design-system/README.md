# Swapmeet Design System — dev hand-off

The Swapmeet brand (Bright Retro Marketplace) as code: design tokens, a brand book, icons, and three React components. Drop-in for the `client` app.

> **Note from Rachel:** I can't make Wednesday's meeting (scheduling conflict). This is the Swapmeet design system packaged for the app — **use it or not, no obligation.** It's plain files and fully editable (see *Editability* below), so it won't box anyone in if the team goes another direction.

---

## What's here

```
swapmeet-design-system/
  tokens.json            source of truth for all values
  tokens.css             compiled CSS variables + Day/Night theming
  tailwind.preset.js     optional Tailwind preset (ergonomic class names)
  index.ts               barrel export
  components/            Button.tsx · Badge.tsx · ItemCard.tsx · Icon.tsx
  icons/                 the 10 icons as raw .svg (reference; Icon.tsx is the React version)
  README.md              this file (also the usage spec for AI coding agents)
```

## How it's configured (3 layers, source flows down)

1. **`tokens.json`** — the single source of truth: colors (Day + Night), type scale, spacing, radii, shadow. Everything else derives from it.
2. **`tokens.css`** — the compiled CSS custom properties (`--teal`, `--bg`, `--radius-md`, …), plus the theme logic: default is Day, follows the OS setting, and `data-theme="dark"` / `"light"` on `<html>` forces a theme.
3. **Components** — `Button`, `Badge`, `ItemCard`, `Icon` in React + TypeScript, styled with Tailwind arbitrary values that reference the CSS variables (e.g. `bg-[var(--teal)]`). Because they point at the variables, they theme automatically and **do not require the Tailwind preset**.

## Setup (Vite + React + TypeScript + Tailwind — the assumed stack)

1. Copy this folder into the client app, e.g. `client/src/design-system/`.
2. Import the tokens once, at your app entry (`main.tsx` or `index.css`):
   ```ts
   import "./design-system/tokens.css";
   ```
3. Load the two Google fonts (in `index.html` `<head>`):
   ```html
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=Atkinson+Hyperlegible+Next:wght@400;500;600;700&display=swap">
   ```
4. Use the components:
   ```tsx
   import { Button, Badge, ItemCard, Icon } from "./design-system";

   <Button variant="primary">Make offer</Button>
   <Badge color="marigold" icon={<Icon name="local" />}>Local</Badge>
   <ItemCard price="$38" title="Vintage ceramic lamp" distance="2.3 miles away"
             rating={4.9} note="Local pickup" badge={{ label: "LOCAL", color: "marigold" }} />
   ```
5. **Optional** — register `tailwind.preset.js` in `tailwind.config.js` to write ergonomic classes like `bg-primary text-fg rounded-token-md` in your own code. Skip it and nothing breaks; the components use CSS variables directly either way.

## Editability & portability (if the team goes another direction)

Everything here is **plain text you own** — nothing is locked.

- **Change a value:** edit `tokens.json`, regenerate `tokens.css` (or just edit the CSS). One source, no hunting through components.
- **Not using Tailwind?** The components are the only Tailwind-specific part. `tokens.css` is framework-agnostic CSS variables — use them in vanilla CSS, CSS Modules, styled-components, or any framework. `tokens.json` feeds Style Dictionary, a theme object, Figma, etc.
- **Not using React?** Same — the tokens carry over to any framework; only the three `.tsx` files would be rewritten. They're small and have no dependencies beyond React.
- **Drop a piece:** delete any file; the rest stands alone. The preset is optional, the icons are optional, the components are optional. The tokens are the only thing worth keeping as the base.
- **Multi-brand / boilerplate:** this is one brand identity expressed as tokens. A second brand = a second token set with the same variable names; the components don't change. That's the token model Luciano described.

**The visual source of truth** is the live Swapmeet design system (a private Claude artifact). It's the canonical reference for how everything should look and read; this folder is its export for the repo. Values here are a snapshot — if the artifact changes, re-export rather than hand-editing in two places.

---

# Usage spec (for AI coding agents and devs)

Brand: Swapmeet — *Friendly, Eclectic, Local, Useful, Optimistic, Resourceful.* Not Cute, not Luxury Vintage, not Green-tech, not AI-first. Copy is plain and warm ("Found it. $38."). The AI in the product stays quiet, under a human marketplace.

## Color

Three colors carry the product: `cream`/`bg`, `ink`, `teal`/`primary`. The rest supply personality. Both `light` (Day) and `dark` (Night) themes are defined; every text-on-ground pair clears WCAG AA.

- Page = `bg`, raised cards = `surface`, recessed panels/filters = `panel`.
- Body text = `text`; metadata/captions = `text-soft` (on `bg`/`surface` only).
- UI roles: `primary` (Deep Teal) top actions, links, focus ring; `secondary` (Leaf) sustainability/local; `accent` (Marigold) highlights/tags; `info` (Denim) categories; `hot` (Tomato) bidding/promotion; `play` (Raspberry) livestream/community.
- Put the matching `on-*` color on any solid fill. `on-accent` is **Ink, never white**; `on-primary/secondary/info/danger` are white.
- `hot` and `play` are **large fills, not small white-text buttons** (they don't clear 4.5:1 at small sizes). `danger` is a separate red for errors/deletion only — never promotion.

## Type

- **Archivo** — headlines and prices; the display + price styles use SemiCondensed width (set `font-stretch:87%`).
- **Atkinson Hyperlegible Next** — body and UI (accessibility-first), with Atkinson Hyperlegible as fallback. Both Google-hosted.
- Scale lives in `tokens.json` under `type.groups` (display, h1–h3, price / listing-title, body, body-sm, label, meta, button). `label` is uppercase with `0.12em` tracking.

## Shape, elevation, motion

Default `radius-md` (13px); `radius-pill` for filters/tags/badges; `radius-lg` for large surfaces. Thick `outline` (2.5px, `line-strong`) frames and chunky color blocks over bubbly rounding. One elevation, `shadow-card`, always with a `line` border. Keep motion minimal; respect reduced-motion.

## Components

- **Button** — `variant`: `primary` | `secondary` | `tertiary` | `destructive`. One primary per view. Accepts all native `<button>` props.
- **Badge** — `color` (marigold/leaf/tomato/teal/denim/raspberry) + `children` label + optional `icon`. **Color never carries meaning alone** — always a word, usually an icon. `tomato`/`raspberry` labels rely on the word, not the color, for meaning.
- **ItemCard** — `price`, `title`, optional `distance`, `rating`, `note`, `image`, `badge`. Hierarchy: price → title → location → seller trust → one badge. One accent element (the badge) max; the photo supplies the color.
- **Icon** — `name` from the 10-icon set (search, sell, swap, bid, messages, local, live, saved, verified, impact), `size`. Drawn with `currentColor`, so recolor with text color.

## Iconography

One outlined family, 2px stroke, rounded, 24px grid, recolored via `currentColor`. Avoid ultra-thin, bubbly, or faux-hand-drawn icons in the UI.

## Photography

Populated and culturally alive: real sellers, thrift/flea markets, crowded racks, texture, neighborhood shops. Avoid beige minimalist interiors, pristine ecommerce shots, and generic "eco lifestyle" stock.
