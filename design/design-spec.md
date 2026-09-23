# SwapMeet design spec — colors, typography, buttons

Status: approved. Source for every item: `design/brand-spec.md` (the only
design evidence; image references were converted into it, so there are no
screenshots). Scope: colors, typography, buttons only. No pages/components.

Labels: **Default** = stated in brand-spec (high confidence).
**Inference** = derived by us (low–medium confidence).

## Colors
| Role | Token | Value | Label |
|---|---|---|---|
| Page background | `paper` | `#F3E9D8` | Default |
| Card / listing backdrop | `chalk` | `#FAF6EF` | Default |
| Body text | `ink` | `#2B2621` (12.5:1 on paper) | Default |
| Primary | `terracotta` | `#C15B3D` | Default |
| Trust / verified / success | `teal` | `#3E7C74` | Default |
| AI assist / negotiation | `plum` | `#6B3F5C` (7:1 on paper) | Default |
| Signage / tags | `mustard` | `#E8A33D` | Default |
| Attention | `coral` | `#F4623A` | Default |
| Discovery / recommendations | `citrus` | `#A8C23B` | Default |
| Border | ink at 15% alpha | `--color-border` | Inference |
| Focus ring | `plum` | | Inference |

### Contrast rules (measured)
- Coral, mustard, citrus are fill/decoration only, never text on paper/chalk (1.7–2.9:1).
- Coral is fill-only (stickers, badges); not a button color.
- Text on mustard/citrus/coral fills: use ink (6.95 / 7.45 / 4.75:1).
- Chalk text on terracotta is 4.03:1: allowed only at >=18px bold (large text).
  Never ink on terracotta (3.45:1).
- Teal text on chalk is 4.49:1: use for large/bold text only.

### Open
- No error state color defined. Decide later; coral is fill-only so it is not
  assumed to be the error color.

## Typography
| Role | Font | Fallback | Label |
|---|---|---|---|
| Display / signage | Permanent Marker | `"Marker Felt", cursive` | Default |
| UI / body | Nunito 400/700 | `system-ui, sans-serif` | Default |
| Tags / stamps | Special Elite | `"Courier New", monospace` | Default |

- Scale (Inference): 12, 14, 16, 18, 24, 32, 48px.
- Body 16px / 1.5 line-height; display 1.1.
- Display fonts have one weight; hierarchy comes from size and color.

## Buttons (all Inference; spec names the actions only)
| Variant | Use | Fill | Text |
|---|---|---|---|
| Primary | Buy now | terracotta | chalk, 700, >=18px |
| Secondary | Make offer | transparent, 2px ink border | ink |
| Tertiary | Swap | chalk | teal, 700, >=18px |
| AI chip | Price / negotiate | plum | chalk |

- Radius 8px (chips: full pill). Padding 10x20px.
- Hover: fill darkens ~8%. Focus: 2px plum ring, 2px offset. Disabled: 50% opacity.
