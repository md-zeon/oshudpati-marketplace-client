# Oshudpati Marketplace — Color Palette Research & Design Tokens

**Author:** UI/UX Lead (orchestrator)
**Date:** 2026-08-10
**Status:** Design system tokens created; applied incrementally by page agents.

---

## 1. Research Summary (sources)

Research was conducted online across healthcare & pharmacy UI/UX literature:

1. **Progress.com — "Healthcare Color Palette: Using Color Psychology for Website Design"** (Dec 2024)
   - Audited 34–35 healthcare/healthtech websites. **57–62% use blue or teal above the fold.**
   - Blue = trust, calm, competence, stability. Green = growth, health, nature.
   - Teal combines "blue's credibility + green's vitality" — used by LetsGetChecked, Bausch + Lomb, Mass General.
   - 42% pair the primary with neutral whites/grays for balance.
   - Whitespace is an accessibility + hierarchy tool, not wasted space.

2. **ColorArchive.org — "Color Palettes for Healthcare Design: Trust, Calm, and Accessibility"**
   - Mid-range blues (hue 200–220°, sat 30–55%) are the most reliable trust foundation.
   - **Slightly warm white backgrounds** (L:98–99%, hue 40–50°, sat 5–10%) read as warm/human instead of cold/institutional.
   - **Target WCAG AAA (7:1) where possible**, minimum AA (4.5:1). Minimum **16px body text**, line-height 1.6–1.8.
   - Every status colour must be paired with an **icon + text label** (8% of men have red-green CVD).
   - Four-layer system: trust foundation / calm surface / positive indicator (green) / alert indicator (red).

3. **Stafix.eu — "How do you choose the right color palette for pharmacy advertising?"** (Feb 2026)
   - Blue + green build trust/cleanliness for health decisions; warm colours (orange/amber) attract attention for wellness/OTC, use sparingly.
   - Minimum contrast 4.5:1 normal text, 3:1 large text; never rely on colour alone.

4. **truewellnessmarketing.com — "Color Psychology for Healthcare Websites"** (May 2026)
   - Blues + greens primary; warm accents (amber/orange) ONLY for CTAs & highlights (too much warmth = anxiety).
   - 85% of leading healthcare logos use blue.

5. **Clarity Ventures — "Top Pharmacy Website Design Tips"** (Mar 2026)
   - Mobile-first is standard (most pharmacy traffic is mobile). Min 44x44px touch targets, stacked form fields, hamburger nav.
   - Generous typography for aging populations; high contrast non-negotiable; WCAG 2.1 AA minimum.

6. **NHS Identity colour guidelines**
   - Blue + white dominant; support colours used in *decreasing levels of emphasis*; all pairings meet at least AA.

7. **60-30-10 rule** (Onething Design, 2026): 60% background/neutrals, 30% secondary surfaces, 10% accent colour.

---

## 2. Final Palette — "Oshudpati Health Teal"

The previous brand was pure emerald (`#059669`, WCAG 3.77:1 — **fails AA for normal text on white**).
Research recommends a **trust-leaning teal-green** that bridges blue-trust + green-wellness, deepened for accessibility.

### Brand — Health Teal (primary)

| Token | Hex | Usage |
|---|---|---|
| `--brand-50` | `#edfcf5` | very light backgrounds, icon chips |
| `--brand-100` | `#d6f7e9` | light badge backgrounds |
| `--brand-200` | `#adeeda` | progress fills, soft borders |
| `--brand-300` | `#78dfc3` | decorative, charts |
| `--brand-400` | `#41c8a7` | icons on light bg |
| `--brand-500` | `#1fb090` | graphics/illustrations |
| `--brand-600` | `#129078` | interactive / hover (3.97:1 — large text) |
| `--brand-700` | `#0c7865` | **PRIMARY** buttons/links (5.4:1 — AA pass) |
| `--brand-800` | `#0b6055` | pressed / active |
| `--brand-900` | `#0a5049` | headings on light bg |
| `--brand-950` | `#042e2a` | hero overlays |

### Trust Blue (secondary / info / admin)

| Token | Hex | Usage |
|---|---|---|
| `--trust-50` | `#eff6ff` | info banners, admin bg |
| `--trust-100` | `#dbeafe` | info chips |
| `--trust-200` | `#bfdbfe` | admin borders |
| `--trust-500` | `#3b82f6` | info text/icons, status "placed" |
| `--trust-600` | `#2563eb` | links on white (5.17:1 — AA pass) |
| `--trust-700` | `#1d4ed8` | admin text |

### Warm Amber (accent / ratings / promotions)

| Token | Hex | Usage |
|---|---|---|
| `--accent-50` | `#fffbeb` | promo card bg |
| `--accent-100` | `#fef3c7` | promo chip bg |
| `--accent-500` | `#f59e0b` | star rating fill, promo accents |
| `--accent-600` | `#d97706` | amber text on white (3.19:1 — large text only) |

### Status (order tracking) — always paired with icon + text

| State | Hex |
|---|---|
| Placed | `#3b82f6` (trust-500) |
| Processing | `#f59e0b` (accent-500) |
| Shipped | `#8b5cf6` (violet-500) |
| Delivered | `#10b981` (emerald-500) |
| Cancelled | `#ef4444` (red-500) |

### Surfaces

| Token | Hex | Rationale |
|---|---|---|
| `--background` | `#faf9f6` | warm off-white page bg (reduces eye strain per research) |
| `--surface` / `--card` | `#ffffff` | pure white cards pop against warm bg |
| `--surface-card` | `#f4f7f5` | tinted secondary surfaces |
| `--border-default` | `#e3e8e5` | warm light borders |

### Text

| Token | Hex | Contrast |
|---|---|---|
| `--text-primary` / `--foreground` | `#142019` | 15.9:1 on bg (AAA) |
| `--text-secondary` / `--muted-foreground` | `#5c6b64` | 5.3:1 on bg (AA) |
| `--text-muted` | `#7d8b85` | captions (use sparingly) |

---

## 3. Design Token Usage Rules

1. **Primary actions** → `bg-brand-700` / `bg-primary`, white text (AA). Hover `brand-600`, active `brand-800`.
2. **Links** → `text-trust-600` on white, `text-brand-700` on tinted surfaces.
3. **Warm amber (`accent`)** → max ~10% of any page. Ratings, promos, highlights only. Never for body text on white.
4. **Status** → always `icon + text label` with the colour, never colour alone.
5. **Surfaces** → pages use `bg-background` (warm off-white); cards use `bg-card`/`bg-surface` (white).
6. **Success/danger** → never invert green/red meaning (healthcare convention).
7. **Focus rings** → `ring-brand-600` for visible keyboard focus (a11y).
8. Tailwind classes like `bg-brand-700`, `text-trust-600`, `bg-accent-50`, `text-brand-900` are available via `@theme inline`.

---

## 4. Application Strategy (incremental — per instruction)

- The full palette is defined as **scale tokens** in `src/app/globals.css`:
  `brand-50..950`, `trust-50..900`, `accent-50..600`, `status-*`, `admin-*`, `info`.
- Global semantic shadcn tokens (`--primary`, `--background`, `--foreground`,
  `--muted-foreground`, `--brand` aliases, ...) are intentionally kept at their
  **original values** so no page changes implicitly.
- **Page agents adopt the new palette ONLY on the pages they improve** by using
  classes like `bg-brand-700`, `text-brand-900`, `bg-trust-50`, `bg-accent-50`,
  `text-trust-600`. No global mass-refactor.
- Recommended replacement for primary buttons on improved pages:
  `bg-brand-700` (#0c7865, 5.4:1 AA) hover `bg-brand-600`, active `bg-brand-800`.
- Promotional CTAs may use `bg-accent-500` with white text (badge size) or
  `bg-accent-50` surfaces.

## 5. Notes for Page Agents

- Adopt these tokens **only on the pages you are assigned** — do NOT mass-refactor unassigned pages.
- If the old `--primary: #059669` looked better on a specific page, the design system now mandates `#0c7865` for AA contrast — keep the new value.
- Hardcoded hexes found in components: `#00704A`, `#00875A`, `#004D33`, `#121824`, `#1f293d` — replace with tokens when you touch those files.
- Always test mobile (320–480px), tablet (768–1024px), desktop (≥1280px).
