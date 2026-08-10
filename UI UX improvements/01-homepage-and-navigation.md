# Agent Report 01 — Homepage & Storefront Navigation — Oshudpati UI/UX Improvement

## Page / Scope

- **Assigned page(s):** Homepage + global storefront shell (top announcement bar, desktop header/content/footer navs, mobile drawer header, mobile bottom navigation, cart flyout & drawer, public footer, homepage home sections)
- **Agent:** big-pickle (opencode)
- **Date:** 2026-08-10
- **Files changed:**
  - `src/app/(public)/layout.tsx` — public shell composition (announcement → header → content → footer navs → main → PublicFooter → mobile bottom nav)
  - `src/app/(public)/page.tsx` — homepage section composition; feature-card color tokens
  - `src/app/(public)/_components/SiteAnnouncement.tsx` — promo bar (brand-700 surface, focus rings)
  - `src/app/(public)/_components/navigation/NavbarHeader.tsx` — utility bar (contact, benefits, language/currency select)
  - `src/app/(public)/_components/navigation/NavbarContent.tsx` — logo + search + Track/Account/Cart
  - `src/app/(public)/_components/navigation/NavbarFooter.tsx` — desktop category/link nav (active states added)
  - `src/app/(public)/_components/navigation/MobileNavbarHeader.tsx` — mobile drawer + menu
  - `src/app/(public)/_components/navigation/MobileNavbarFooter.tsx` — mobile bottom tab bar + search dialog
  - `src/app/(public)/_components/navigation/PublicFooter.tsx` — site-wide footer (dark surface)
  - `src/components/shared/home/FeaturedMedicinesSection.tsx`
  - `src/components/shared/home/TopRatedMedicinesSection.tsx`
  - `src/components/shared/home/TestimonialsSection.tsx`
  - `src/components/shared/home/FeatureCard.tsx`
  - `src/components/shared/home/WhyChooseUsSection.tsx`
  - `src/components/shared/Logo.tsx` — brand logo wordmark
  - `src/components/shared/cart/Cart.tsx` — desktop hover cart flyout
  - `src/components/shared/cart/MobileCartDrawer.tsx` — mobile cart drawer

## 1. Research Findings (online sources)

- Sources consulted (name, URL, key finding):
  1. **Baymard Institute — Cart & Checkout Usability Research** — https://baymard.com/research/checkout-usability — Mini/slide-out carts confirm an add-to-cart action without interrupting browsing; shipping thresholds should be surfaced early; empty cart states must be a re-entry point, not a dead end.
  2. **Baymard Institute — Cart Abandonment Rate Statistics** — https://baymard.com/lists/cart-abandonment-rate — ~70% of carts abandoned; mobile abandonment runs ~85%; hidden shipping costs are a top abandonment trigger → free-shipping progress meter belongs in the cart.
  3. **BelVG — Shopping Cart UX Best Practices (2026)** — https://belvg.com/blog/best-practices-for-ecommerce-shopping-carts.html — "Use the empty cart state as a re-entry point, not a dead end"; keep cart persistent across sessions; show a visually dominant single checkout CTA.
  4. **UX Planet (Nick Babich) — Bottom Tab Bar Design Best Practices** — https://uxplanet.org/bottom-tab-bar-design-best-practices-ef3ee71de0fc — Bottom bars work best with **3–5 destinations**; always pair an active-state indicator with tabs; never shrink tap targets.
  5. **UX Design World — Bottom Tab Bar Navigation Best Practices** — https://uxdworld.com/bottom-tab-bar-navigation-design-best-practices/ — Use **counter badges** on tabs to show new items; define clear active/inactive states; show an empty state rather than hiding content; keep layout fixed and thumb-reachable.
  6. **Google Material Design 3 — Navigation bar guidance** — https://m3.material.io/components/navigation-bar — 3–5 top-level destinations, 44×44px minimum touch target, indicator on the active destination.
  7. **Clarity Ventures — Top Pharmacy Website Design Tips** — https://www.clarity-ventures.com/hipaa-ecommerce/pharmacy-web-design — Pharmacy UX: minimum **44×44px** tap targets, mobile-first, WCAG 2.1 AA, clear navigation hierarchy to reduce cognitive load for users with varying health literacy.
  8. **ColorArchive — Color Palettes for Healthcare Design** — https://colorarchive.org/guides/color-palette-for-healthcare — Teal/blue signal trust and calm for healthcare; target WCAG AA (4.5:1) for body text and AAA where possible; never rely on color alone for status (pair with icon + label).
  9. **G&CO. — Healthcare Web Design Trends & Best Practices** — https://www.g-co.agency/insights/healthcare-web-design-trends-best-practices-inspiration — Low-contrast text is the #1 detectable WCAG failure; users form a credibility impression in under 50ms; accessibility is a hard legal requirement (WCAG 2.1 AA).
  10. **Spread Simple — Healthcare Website Design Best Practices** — https://spreadsimple.com/blog/healthcare-website-design-best-practices-examples-and-tips-for-2026/ — The homepage is the "storefront": lead with trust signals, clear CTAs, visible contact info, mobile-first layout with large tap targets.

- Best-practice patterns applied to this page set:
  - **Persistent mini-cart (desktop hover flyout) + mobile cart drawer** — confirms add-to-cart without navigating away (Baymard/BelVG).
  - **Free-shipping progress meter inside every cart surface** — reduces surprise-cost abandonment and encourages upsell (Baymard).
  - **Empty-cart state with a "Start Shopping" CTA** — re-entry point instead of dead end (BelVG).
  - **Live counter badge on the mobile bottom "Cart" tab** — the counter-badge tab pattern (UX Design World / Material).
  - **5-tab bottom navigation (Home, Categories, Search, Cart, Account)** — the 3–5 destination rule (Babich / Material / UX Design World).
  - **Active-state indicators** — `text-brand-700` + underline/indicator bar, matching Material's "indicator on active destination".
  - **44px+ touch targets** on all mobile controls (Material / Clarity Ventures).
  - **Healthcare trust palette** — teal brand primary, warm amber accent (used sparingly, 60-30-10), neutral warm surface; status still conveyed with icon + text, never color alone (ColorArchive / research baked into `globals.css`).
  - **WCAG AA contrast + focus-visible rings on every interactive element** — directly addresses the #1 healthcare web failure (low contrast) and keyboard navigation (G&CO / Clarity).

## 2. Problems Found (before)

- [x] Inconsistent raw Tailwind colors (`gray-*`, `slate-*`, `emerald-*`, `amber-*`) mixed with the new brand/trust/accent token system across the storefront shell and homepage → no single visual language.
- [x] Desktop `NavbarFooter` links had no active-page indication; hover/accent colors were inconsistent with the design system.
- [x] Mobile bottom nav had a **Wishlist** tab and **no Cart tab** — mobile users had to reach the cart only via the tiny header icon; no item-count badge anywhere on mobile.
- [x] Mobile bottom nav Home tab used a Store icon/label and no active indicator.
- [x] Mobile drawer "My Account" link reused a question-mark (`CircleQuestionMark`) icon — misleading semantics.
- [x] Mobile drawer menu had no direct link to the Shop.
- [x] Mobile search dialog (`CommandDialog`) used legacy `primary` emerald colors, raw `slate-*` text, and mismatched hover states.
- [x] Mobile drawer social icons were `<Image>`-based with external/guessed URLs → blank/broken when images unavailable.
- [x] Public footer used raw `gray-950`/`emerald-600` → clashed with the teal design system.
- [x] Homepage home sections (Featured, Top Rated, Testimonials, Why Choose Us) used raw emerald/amber/gray/slate classes.
- [x] Rating stars used low-contrast `slate-200` empty states and inconsistent amber; not mapped to `accent-*` tokens.
- [x] Cart hover flyout and mobile cart drawer: raw `emerald-600` CTAs, `slate-*` text/borders, `bg-slate-900` shipping progress bar — inconsistent; remove buttons had tiny tap targets.
- [x] Hamburger / close icon buttons used default (36px) icon sizes — below the 44px target.
- [x] Focus rings (focus-visible) were missing or inconsistent on nav links and icon buttons.

## 3. Improvements Made

- **Design-token replacement across the shell & homepage**
  - Replaced hardcoded colors with tokens: `brand-50…950`, `trust-50…700`, `accent-50…600`, `status-shipped`, `danger`, `foreground`, `muted` / `muted-foreground`, `background` / `card`, `border-default`.
  - `page.tsx` feature cards: emerald→`brand`, blue→`trust`, violet→`status-shipped`, amber→`accent`.
  - `WhyChooseUsSection`/`FeatureCard`: badge chip → `bg-brand-50 text-brand-700`; headings/text → `foreground`/`muted-foreground`; hover → `brand-700`.
  - `FeaturedMedicinesSection` & `TopRatedMedicinesSection`: cards → `bg-card` + `border-border-default`, generic chip → `text-brand-600`, rating pill → `bg-accent-50 text-accent-600` with `fill-accent-500` stars.
  - `TestimonialsSection`: heading/copy → `foreground`/`muted-foreground`, stars → `accent-500`/`border-default`, avatar fallback → `bg-brand-50 text-brand-700`, verified badge → `text-brand-600`.
- **Desktop navigation active states (`NavbarFooter`)**
  - Active link = `text-brand-700` + `font-semibold` + a `bg-brand-600` underline bar; `aria-current="page"` set; focus-visible rings `outline-brand-600`.
- **Mobile bottom navigation (`MobileNavbarFooter`)**
  - Replaced the Wishlist tab with a **Cart tab** showing a **live item-count badge** (signed-in: server cart via `authClient.getSession()` + `getCartItems`; guest: `getLocalCart()`), updated on the `local-cart-updated` event.
  - Home tab now uses the Home icon; active tabs get `text-brand-700` + top indicator bar; badge capped at "9+".
  - Search dialog fully tokenized (`brand-*` icons/chips, `accent-500` flame, `foreground`/`muted-foreground` text, `border-border-default`, brand-hover list items).
- **Mobile drawer header (`MobileNavbarHeader`)**
  - Added a direct **"Shop All"** menu link; fixed the account icon to `User`; hamburger/close buttons enlarged to `h-11 w-11` (44px target).
  - Drawer surface tokenized (`bg-background`, `muted` section labels, `brand-600` icons, `border-border-default` footer); social icons converted to inline SVGs (no broken image fetches).
- **Public footer (`PublicFooter`)**
  - Rebuilt on the dark surface token (`bg-foreground`, `border-white/10`, `bg-white/10` chips) with brand hover accents (`hover:bg-brand-500`, `text-brand-400` icons, `hover:text-brand-300` links); responsive accordion on mobile retained.
- **Cart surfaces (`Cart.tsx`, `MobileCartDrawer.tsx`)**
  - Tokenized borders/text/CTAs; checkout CTAs → `bg-brand-600 hover:bg-brand-700`; remove buttons → `danger` tokens with larger tap areas; free-shipping meter → `muted-foreground`/`brand-500`; empty states → `accent-*` with "Start Shopping" re-entry CTA.
- **Accessibility**
  - `focus-visible:outline-2 outline-offset-2 outline-brand-600` added to every interactive nav element; `aria-current` on active links; `aria-label`s on icon-only buttons (menu, close, dismiss, social).
  - 44px touch targets on hamburger/close and search-dialog category rows.
- **Responsive behavior**
  - Desktop-only elements gated by `lg:` (header/content/footer navs, hover cart); mobile-only drawer + bottom bar gated by `lg:hidden`; `pb-safe` retained on the bottom bar.

## 4. shadcn/ui Components Used or Installed

| Component | New/Existing | Purpose |
|---|---|---|
| `Button` | existing | menu/close/cart/dismiss triggers, cart + checkout CTAs |
| `Drawer` (vaul) | existing | mobile nav drawer (left) + mobile cart drawer (bottom) |
| `Separator` | existing | section dividers inside the mobile nav drawer |
| `Badge` | existing | popular-medicine chips and brand tags in the search dialog |
| `Command` / `CommandDialog` / `CommandInput` / `CommandList` / `CommandEmpty` / `CommandGroup` / `CommandItem` | existing | mobile search dashboard (discovery + live results) |
| `HoverCard` | existing | desktop mini-cart flyout trigger/content |
| `Accordion` | existing | mobile footer link groups |
| `Select` | existing | language/currency switcher in the utility bar |
| `Avatar` | existing | testimonial avatars (image/fallback initials) |

No new components were installed in this pass.

## 5. Design Tokens Used

- Brand: `bg-brand-50/100`, `text-brand-600/700`, `bg-brand-600/700`, `bg-brand-500`, `border-brand-200/300`, `outline-brand-600`, `text-brand-100`, `hover:bg-brand-500`
- Trust: `text-trust-600`, `bg-trust-50`
- Accent: `bg-accent-50`, `text-accent-500/600`, `fill-accent-500`, `border-accent-200`
- Status: `text-status-shipped`, `bg-status-shipped/10`
- System: `text-danger`, `bg-danger/10`
- Surfaces: `bg-background`, `bg-card`, `bg-muted`, `bg-foreground` (dark footer surface)
- Text: `text-foreground`, `text-muted-foreground`, `text-white/70/90`, `text-white`
- Borders: `border-border-default`, `border-white/10`
- Backdrop: `bg-background/95`, `backdrop-blur`

## 6. Responsive Verification

- **Mobile (<=480px):** code-verified. Bottom tab bar (5 tabs + live cart badge) visible; drawer header with 44px triggers; cart drawer `max-h-[85vh]`; footer collapses to accordion; search dialog `max-h-[80vh]`. Typecheck + ESLint pass. Recommend a real-device pass to confirm badge overlap and `pb-safe` behavior in browsers that ignore it.
- **Tablet (768–1024px):** code-verified. Top navs hidden until `lg:`; category grid 2-col; mobile drawer still applies under `lg`; testimonial columns 2. Typecheck + ESLint pass. Visual pass recommended.
- **Desktop (>=1280px):** code-verified. Announcement → utility bar → logo/search nav → link nav → content; `max-w-360` container; hover cart flyout `w-95` aligned end; home grids 3-col. Typecheck + ESLint pass.
- **Note:** verification to date is static (TypeScript + ESLint, zero errors in changed files); a visual/browser QA pass on all three breakpoints is the recommended next step.

## 7. Before / After

- **Before:** a storefront shell with mixed legacy colors (slate/gray/emerald/amber) next to the new teal system, no active nav states, a mobile bottom bar with a Wishlist tab and no cart access or count, tiny 36px icon controls, a raw emerald checkout button in the cart flyout/drawer, and a gray/emerald footer.
- **After:** a consistent, tokenized storefront: active desktop nav with underline indicator, a 5-tab mobile bottom bar with a **live cart-count badge**, 44px touch targets, focus rings everywhere, teal-branded cart CTAs with danger-coded removes, free-shipping meters, warm-amber ratings, and a dark brand-tinted footer. The homepage home sections now render from the same design system as the shell.

## 8. Remaining / Follow-up

- [ ] Browser/visual QA at mobile, tablet, and desktop breakpoints (badge overlap, drawer animation, `pb-safe`, mask utilities in Testimonials).
- [ ] Wishlist was removed from the mobile bottom bar but remains in the drawer menu and desktop nav — confirm it is still reachable for the intended user flow, or add a badge.
- [ ] `Logo.tsx` still exposes a legacy `emerald` color option in `COLOR_MAP` — safe to prune once consumers are migrated.
- [ ] Continue tokenization + active-state work on downstream pages: `02-shop.md` (shop list/filters), `03-product.md` (medicine detail), `04-cart-checkout.md`.
- [ ] Social links point to placeholder URLs (`facebook.com`, `x.com`, …) — replace with real brand accounts.
- [ ] `Select` items for Bengali (বাংলা) and USD remain disabled — future i18n/multi-currency work.
- [ ] Order-tracking/status components should double-check `status-*` tokens pair color with icon + label (WCAG "no color alone").
