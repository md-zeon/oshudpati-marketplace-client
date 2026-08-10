# Agent Report — Oshudpati UI/UX Improvement (Cart, Checkout, Order Received, Order Tracking, Wishlist)

## Page / Scope

- **Assigned page(s):** `/cart` (full cart + header cart + mobile cart drawer), `/checkout` (multi-step checkout + order summary), `/checkout/order-received/[orderNumber]`, `/order-tracking` (search + live order details), `/wishlist` (saved medicines grid + empty state + shared wishlist button)
- **Agent:** opencode (big-pickle)
- **Date:** 2026-08-10
- **Files changed:**
  - `src/components/shared/cart/Cart.tsx` (header cart + flyout)
  - `src/components/shared/cart/MobileCartDrawer.tsx`
  - `src/app/(public)/cart/page.tsx` (glue)
  - `src/app/(public)/cart/_components/FullCart.tsx`
  - `src/app/(public)/cart/_components/EmptyCart.tsx`
  - `src/app/(public)/checkout/page.tsx`
  - `src/app/(public)/checkout/_components/checkoutForm.tsx`
  - `src/app/(public)/checkout/_components/addressSection.tsx`
  - `src/app/(public)/checkout/_components/cartSummaryItem.tsx`
  - `src/app/(public)/checkout/_components/SubmitButton.tsx`
  - `src/app/(public)/checkout/_components/MobileOrderSummary.tsx`
  - `src/app/(public)/checkout/_contexts/CheckoutContext.tsx`
  - `src/app/(public)/checkout/order-received/[orderNumber]/page.tsx`
  - `src/app/(public)/checkout/order-received/[orderNumber]/_components/CopyOrderNumber.tsx`
  - `src/app/(public)/order-tracking/page.tsx`
  - `src/app/(public)/order-tracking/_components/OrderTrackingForm.tsx`
  - `src/app/(public)/order-tracking/_components/OrderDetails.tsx`
  - `src/app/(public)/wishlist/page.tsx`
  - `src/app/(public)/wishlist/_components/WishlistGrid.tsx` (new)
  - `src/app/(public)/wishlist/_components/WishlistItemCard.tsx` (new)
  - `src/app/(public)/wishlist/_components/WishlistSkeleton.tsx` (new)
  - `src/components/shared/wishlist/WishlistButton.tsx`

## 1. Research Findings (online sources)

- Sources consulted (name, URL, key finding):
  1. **Baymard Institute — "Checkout UX 2025: 10 Pitfalls and Best Practices"** (https://baymard.com/blog/current-state-of-checkout-ux) — 64% of desktop and 63% of mobile checkouts benchmark "mediocre or worse"; checkout design alone can lift conversion ~35%. Highlights: explicit required/optional field marking, explaining why a phone number is required, adaptive validation errors.
  2. **Baymard Institute — "Ecommerce Checkout UX Guide"** (https://baymard.com/learn/checkout-flow-ux-optimization) — average cart-abandonment is 70.22%; top abandonment drivers are unexpected extra charges (39%), forced account creation (19%), long/complex process (18%), and missing payment option (10%). Best practice: surface full costs early, preselect smart defaults, never clear entered data on error, use specific recovery messaging, linear predictable flow with a literal progress indicator.
  3. **Baymard Institute — "Always Provide 6 Key Order-Tracking Details"** (https://baymard.com/blog/integrate-tracking-info) — 50% of surveyed users say order tracking is the most important account feature, yet 67% of sites fail to provide it consistently. Required details: expected delivery date, order-status progress bar, carrier, linked tracking number, detailed shipping history, package-contents summary.
  4. **NN/g — "Adding an Item to a Shopping Cart: Provide Clear, Persistent Feedback"** (https://www.nngroup.com/articles/cart-feedback/) — confirm add-to-cart with a badge + persistent confirmation (overlay/banner) + label change; never rely on disappearing popovers; users need to review exactly what was added.
  5. **NN/g — "Decision Making in the Ecommerce Shopping Cart"** (https://www.nngroup.com/articles/shopping-cart/) — shoppers use the cart as a decision/compare space: show adequate product images, link names to product pages, and make removal easy and obvious; support "remove via quantity to zero".
  6. **NN/g — "Wishlist or shopping cart? Saving products for later"** (https://www.nngroup.com/articles/wishlist-or-cart/) — saved-items features must be discoverable, low-effort, clearly labeled, and (strongly recommended) not gated behind login; users abandon wishlists that demand registration.
  7. **Ecommerce Guide — "Order tracking page design: 3 ecommerce patterns"** (https://ecommerceguide.com/patterns/track-order/) — the vertical step timeline is the de-facto marketplace/carrier pattern; every step gets a bullet, time, headline, and body line; keep future steps clearly inactive.
  8. **Ecommerce Guide — "Wishlist design: 3 ecommerce UX patterns"** (https://ecommerceguide.com/patterns/wishlist/) — the dominant marketplace pattern is a "grid with quick-add to cart": in-stock / on-sale / out-of-stock states baked into each tile with an add-to-cart button per card; avoid a "brutal" empty state.
  9. **Flits — "Shopify Wishlist Best Practices"** (https://www.getflits.com/blog/shopify-wishlist-best-practices-proven-ways-to-turn-saves-into-sales) — put an Add to Cart button directly on each wishlist item; every click between wishlist and checkout is an exit opportunity; allow guests to save items; use back-in-stock / price-drop alerts on saved items.
  10. **Yotpo — "ECommerce Wishlist Best Practices"** (https://www.yotpo.com/ecommerce-product-page-guide/wishlists/) — Google research: 40% of shoppers want a wishlist feature; a good wishlist must be one-click, accessible site-wide, mobile-friendly, and not gated behind login.
  11. **Metricuno — "Add-to-Cart Optimization: Button, Drawer & Flow Guide"** (https://www.metricuno.com/add-to-cart-optimization) — mobile CTAs need ≥48px touch targets; every add-to-cart button needs an explicit loading state and retry-friendly errors; a free-shipping progress bar reliably lifts AOV 5–10%.
  12. **shipped.online — "Tracking Pages That Cut Support Tickets"** (https://shipped.online/designing-customer-facing-tracking-pages-that-reduce-support) — tracking pages should answer "where is my order?" above the fold: order number, human-language status, delivery estimate, last-scan/update time, and a clear next action.
  13. **VASUYASHII — "Order Tracking Page Design for Ecommerce"** (https://www.vasuyashii.com/blog/order-tracking-page-design) — accessibility: use text + icons, never colour alone; show last-update time; keep layout stable while events load; mask personal data; don't show a sequential ID.
  14. **NN/g — "Shopping Carts, Checkout & Registration" report** (https://www.nngroup.com/reports/ecommerce-ux-shopping-carts-checkout-registration/) — minicart is a feedback surface, not a cart replacement; 137 design recommendations across cart and checkout.
- What best-practice patterns apply to these pages: progress indicators that map 1:1 to checkout steps; early cost transparency (subtotal/delivery/discount/total); explicit required/optional fields with adaptive inline errors and focus-to-error; phone-field explanation; sticky mobile purchase/checkout bars with ≥44px targets; free-shipping progress bars; product images + name links + easy removal in carts; order-tracking pages with progress timeline, status icon+text, last-updated time, and package contents; wishlist grids with per-card add-to-cart, discount/out-of-stock states, and a recovery-oriented empty state.

## 2. Problems Found (before)

### Cart (FullCart / EmptyCart / Cart / MobileCartDrawer)
- [x] Hardcoded legacy colors everywhere (`bg-slate-*`, `text-slate-*`, `bg-white`, `border-slate-200`, `bg-emerald-600`, `text-slate-400`) that bypass the design-token system.
- [x] Empty state was a plain centered block with raw `slate` colors and a single link — no shadcn `Empty` pattern, no category fallback path.
- [x] Mobile cart page had no sticky checkout bar; the total was only reachable at the bottom of the page.
- [x] Free-shipping progress was a bare `<div>` with no `role="progressbar"` semantics, no `aria-valuenow` and no label.
- [x] Quantity steppers were plain `<button>`s with no `aria-label`s; remove buttons lacked accessible names.
- [x] No trust signals (secure checkout, COD availability) in the summary; guest users saw no note that sign-in is required at checkout.
- [x] No desktop column headers for the cart item matrix; per-item layout collapsed awkwardly between mobile and desktop.
- [x] Header cart flyout and mobile drawer had inconsistent empty states, muted styling, and no product-image fallback.

### Checkout (checkoutForm / addressSection / cartSummaryItem / SubmitButton / MobileOrderSummary / page / CheckoutContext)
- [x] No visible checkout progress indicator; users couldn't tell where they were in the flow.
- [x] Address/step sections used raw card markup with no numbered step affordance, no `RadioGroup` semantics for saved addresses, and no visual selection state.
- [x] Validation errors were shown as toast-only; no inline field errors, no `aria-invalid`/`aria-describedby`, no scroll/focus-to-first-error recovery (Baymard: errors must be recoverable and specific).
- [x] Phone field had no helper explaining why the number is required and no `inputMode="tel"`/`autoComplete`.
- [x] Optional fields were not visually differentiated from required ones; no "required *" markers.
- [x] Mobile had no order summary until checkout; no collapsible summary, no sticky total bar with the submit action.
- [x] Submit button gave no loading feedback ("Placing your order…") and no security affordance.
- [x] COD payment method had no trust context (verify before paying), and cart summary items had no seller attribution.

### Order Received page
- [x] No success hero / no completed progress indicator; receipt information was hard to scan.
- [x] Order number had no copy affordance; payment status was colour-only (research: never colour alone).
- [x] No "what happens next" explanation (confirmation call → dispatch → delivery estimate), which drives post-purchase anxiety and support tickets.
- [x] Totals rows were unstyled; discount row, free-delivery state, and total emphasis were weak.

### Order Tracking (page / OrderTrackingForm / OrderDetails)
- [x] Tracking form had no label, no validation (empty submit), no error/hint text, and used legacy `slate` colors.
- [x] Order details used hardcoded `slate`/`rose`/`emerald` colors; no status token colors with icon+text.
- [x] No per-vendor progress timeline (Baymard's key detail #2 — status progress bar) and no "last updated" timestamp.
- [x] Cancelled vendor orders had no distinct visual treatment.
- [x] No delivery address snapshot display and no discount row in totals.

### Wishlist (page / WishlistButton)
- [x] Entire page used raw `slate`/`rose`/`emerald` hardcoded colors bypassing tokens.
- [x] No way to remove an item from the wishlist page and no add-to-cart affordance (research: wishlist → cart shortcut is the dominant marketplace pattern).
- [x] Empty state was a dead end (single link, muted slate styling) with no recovery actions.
- [x] No discount badge, no out-of-stock state, and no touch-target sizing on wishlist cards.
- [x] No loading skeleton while the wishlist streamed in.
- [x] `WishlistButton` used a sub-44px touch target (32px), `text-rose-500`/`text-slate-400` off-palette colors, and no `aria-pressed` toggle state.
- [x] Wishlist page fetched inside the page component (no Suspense boundary) and offered no skeleton/streaming UX.

## 3. Improvements Made

### Cart
- **`FullCart.tsx`** — Rebuilt the whole cart page with tokens. Added a mobile sticky checkout bar (`fixed bottom-16`, above the mobile bottom nav) showing grand total + shipping note with a branded Checkout CTA; free-shipping banner now uses a `role="progressbar"` with `aria-valuemin/max/now` + `aria-label`, brand-colored fill (`bg-brand-400`→`bg-brand-600`), and switches to a success state ("Your order qualifies for free shipping!") with an estimated-delivery line. Added desktop column headers (Product/Price/Quantity/Subtotal) on `md:grid-cols-12`; per-row grid adapts (`grid-cols-2 md:grid-cols-12`). Quantity steppers are now icon buttons with `aria-label`s ("Increase/Decrease quantity of …"), disabled states, `aria-live` quantity, stock caps, and brand hover. Remove button is a ghost icon button with `aria-label`, `hover:bg-danger/10 hover:text-danger`. Right column is a sticky Order Summary (`lg:sticky lg:top-40`) with `dl` semantics, subtotal/delivery/est. delivery rows, free-delivery hint chip (`bg-accent-50 text-accent-600`), "to {area}, {district}" from the default address, `text-success` FREE state, trust-signal list (secure checkout, COD), guest note, and a primary Checkout CTA (`bg-brand-700`). "Continue shopping" is a focus-visible brand link.
- **`EmptyCart.tsx`** — Rebuilt with shadcn `Empty`/`EmptyHeader`/`EmptyMedia`/`EmptyTitle`/`EmptyDescription`/`EmptyContent` on a `bg-brand-50` media chip, brand heading, recovery copy (free delivery over ৳300), primary "Start Shopping" (`bg-brand-700`) and ghost "Browse Categories" buttons.
- **`Cart.tsx`** (header cart + flyout) — Tokenized hover trigger and flyout (`bg-card`, `border-border-default`, `rounded-2xl`); empty state uses a branded accent "?" badge with the free-shipping tracker; active state lists items with remove buttons (`bg-danger/10 text-danger`), product thumbnails, name links, quantity × price, subtotal block, View Cart (outline) + Checkout (brand) split CTAs, and the free-shipping progress tracker (brand fill when qualified).
- **`MobileCartDrawer.tsx`** — Tokenized Drawer with a count badge (`bg-brand-600`), item rows with `bg-muted` cards, trash button with danger hover, subtotal + free-shipping progress + dual CTAs in a sticky footer, and a branded empty state with "Start Shopping".

### Checkout
- **`page.tsx`** — Added a horizontal `Stepper` progress indicator (Cart → Delivery & Payment → Confirmation) with completed state in `bg-brand-700`; "Back to cart" link; tokenized page header; desktop sticky Order Summary `Card` (scrollable item list, subtotal/delivery/total payable, `Separator`, SubmitButton, trust signals); collapsible `MobileOrderSummary` above the forms; and a mobile sticky checkout bar (`fixed bottom-16`) reusing `SubmitButton` (single submit instance, no duplicate forms).
- **`checkoutForm.tsx`** — Central error model with per-field `FieldErrors`; on validation failure scrolls to and focuses the first invalid field (`data-checkout-field` selectors, `scrollIntoView({ block: "center" })` + `focus({ preventScroll: true })`), with an inline error message; `noValidate` custom validation; Bangladeshi phone regex; payload unchanged.
- **`addressSection.tsx`** — Numbered step cards (1 Delivery Address, 2 Delivery Notes, 3 Payment Method) with brand number chips + icons; saved addresses as a real `RadioGroup` with selected state (`border-brand-600 ring-1 ring-brand-600 bg-brand-50`) and focus-within ring; "Default" chip (`bg-brand-100 text-brand-800`); "Ship to a different location" checkbox row; custom address form (grid 1→2 cols on `sm:`) with per-field `AddressField` (required asterisk `text-danger`, "(optional)" label, `aria-invalid` + `aria-describedby` error IDs, `inputMode`/`autoComplete`, error icon+text, `border-danger/60` invalid state); phone helper ("We'll call this number to confirm your delivery"); notes textarea with helper; COD payment card with "Recommended" chip, verify-before-pay copy, and trust list (secure checkout, keep exact change).
- **`cartSummaryItem.tsx`** — Tokenized rows (image tile `bg-surface-card`, `text-brand-900` name, Qty, bold price).
- **`SubmitButton.tsx`** — Full-width brand submit with loading spinner ("Placing your order…") and lock icon ("Confirm Order"); reads `submitting` from context.
- **`MobileOrderSummary.tsx`** — Collapsible mobile summary with `aria-expanded`/`aria-controls`, rotating chevron, item list, and subtotal/shipping rows (FREE state).
- **`CheckoutContext.tsx`** — Typed context (address selection, custom address, customer note, submitting, errors) so the submit state is shared between the desktop card and the mobile sticky bar.
- **`order-received/[orderNumber]/page.tsx`** — Success hero (brand check circle, "Order Placed Successfully / Payment Confirmed", "Thank you for your order!"), completed 4-step `Stepper`, order-meta ribbon (order reference with `CopyOrderNumber`, order date, payment-status badge with icon+text in `bg-accent-50`/`bg-brand-50`/`bg-danger/10`), "What Happens Next" 3-card strip (Confirmation call, Dispatch within 24h, Delivery estimate), items summary with seller chips (`bg-brand-50 text-brand-700`), totals block with discount row (`text-accent-600`) and delivery FREE (`text-success`) + `Separator` + emphasised total, delivery address card incl. customer note, and tokenized action buttons (Track My Order / View My Orders / Continue Shopping).
- **`CopyOrderNumber.tsx`** — Client copy button with clipboard API, copied check state, and toasts.

### Order Tracking
- **`page.tsx`** — Tokenized hero (brand gradient band, `bg-brand-100` icon chip), auth-required card (trust lock icon), "Order Not Found" error state (danger icon, mono order-number chip on `bg-surface-card`, "Try Another Order Number" outline button), and success banner with "View Receipt" link.
- **`OrderTrackingForm.tsx`** — Labelled "Order Number" input with search icon, placeholder `ORD-XXXXXXXX`, inline validation with `role="alert"` error and `aria-invalid`/`aria-describedby`, helper hint text, and a branded Track Order button; preserves `router.push('/order-tracking?orderNumber=…')`.
- **`OrderDetails.tsx`** — Tokenized, research-aligned details: header card (mono order number, placed date, payment badge icon+text, total badge); totals grid (subtotal/delivery/total) with "You saved ৳X" for discounts; delivery-address card; per-vendor cards with seller header, plain-language status message + icon, "Last updated: {time}" (`Clock`), a **vertical `Stepper` timeline** (Placed → Processing → On the Way → Delivered) where the active step uses its `status-*` token colour with icon + ring and completed steps get brand checkmarks, and a distinct cancelled state (danger tint, no timeline); tokenized item rows with images, qty × unit price, and line totals.

### Wishlist
- **`page.tsx`** — Tokenized hero band with brand heart chip (`bg-brand-50 ring-1 ring-brand-100`), `text-brand-900` heading, subtitle, and an outline "Browse Shop" action; streams the grid through a `Suspense` boundary so `WishlistSkeleton` renders while data loads; redirects to `/signin` when unauthenticated (existing behaviour preserved).
- **`_components/WishlistGrid.tsx`** (new, server) — Fetches `WishlistService.getMyWishlist()` (same call/logic as before), renders a live item count, and shows either the responsive card grid (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`, `stagger-children`) or a full shadcn `Empty` state inside a dashed card with "Browse Shop" (primary) + "Browse Categories" (ghost) recovery actions.
- **`_components/WishlistItemCard.tsx`** (new, client) — Card with: clickable product image (`aspect-[4/3]`, hover zoom, focus ring); `WishlistButton` overlay for removal (reuses the shared toggle action; on removal triggers `router.refresh()` so the item leaves the grid); discount badge (`bg-brand-50 text-brand-800`, "X% OFF"); generic-name chip; `text-brand-900` name link; price + strikethrough original; and a full-width "Add to Cart" button (existing `addToCart` server action) with loading spinner, and a disabled "Out of Stock" state with icon — directly applying the Flits/Ecommerce-Guide "quick-add on each tile" pattern.
- **`_components/WishlistSkeleton.tsx`** (new) — 8 tokenized `Skeleton` cards matching the grid layout.
- **`WishlistButton.tsx`** — Tokenized: `bg-card/90` + `border-border-default` + backdrop blur over product imagery; inactive heart `text-muted-foreground` → hover `text-brand-600`; active heart `text-brand-600 fill-brand-600` (off-palette `rose`/`slate` removed); enlarged touch targets (`size-9/10/11` = 36/40/44px); explicit `focus-visible:ring-2 ring-brand-600`; `aria-pressed={wishlisted}` toggle semantics; preserved auth-check, sign-in toast, optimistic toggle, and `onToggle` callback.

## 4. shadcn/ui Components Used or Installed

| Component | New/Existing | Purpose |
|---|---|---|
| `Card`, `CardContent`, `CardHeader`, `CardTitle` | existing | cart flyout, order summaries, checkout step cards, receipt cards, order-details cards, wishlist tiles |
| `Button` (+ `asChild`) | existing | all CTAs, quantity steppers, remove/copy/toggle buttons |
| `Badge` | existing | payment status, default-address chip, seller chip, discount %, "Recommended" chip, total badge |
| `Input`, `Textarea`, `Checkbox`, `RadioGroup`/`RadioGroupItem` | existing | address form fields, saved-address selection, "ship elsewhere" toggle, delivery notes, COD selection |
| `Separator` | existing | totals dividers (checkout, receipt) |
| `Stepper` (+ Item/Indicator/Separator/Title) | existing | checkout progress (checkout, receipt) and per-vendor tracking timeline (order tracking) |
| `Drawer` (+ Trigger/Content/Header/Title/Close) | existing | mobile cart drawer |
| `HoverCard` (+ Trigger/Content) | existing | header cart flyout |
| `Empty` (+ Header/Media/Title/Description/Content) | existing | cart empty state and wishlist empty state |
| `Skeleton` | existing | wishlist streaming loading state |
| `StarRating`, `PriceDisplay`, `AppBreadcrumb` | existing (consume-only) | shared display components (not edited) |

No new dependencies were installed; all changes use existing components and tokens.

## 5. Design Tokens Used

- `bg-brand-700`, `bg-brand-600`, `bg-brand-800`, `bg-brand-50`, `bg-brand-100`, `bg-brand-200`, `bg-brand-400`, `text-brand-600`, `text-brand-700`, `text-brand-800`, `text-brand-900`
- `bg-trust-50`, `text-trust-600`
- `bg-accent-50`, `bg-accent-100`, `bg-accent-500`, `border-accent-200`, `text-accent-600`
- `bg-status-placed`, `bg-status-processing`, `bg-status-shipped`, `bg-status-delivered`, `bg-status-cancelled`, `text-status-cancelled`
- `text-success`, `text-danger`, `bg-danger/10`, `border-danger/60`, `ring-danger/30`
- `bg-surface-card`, `bg-card`, `bg-background`, `bg-card/90`, `bg-card/95`, `border-border-default`, `divide-border-default`
- `text-foreground`, `text-muted-foreground`, `font-mono` (order numbers)
- `ring-brand-600`, `focus-visible:ring-brand-600`, `focus-visible:outline-brand-600`
- `bg-linear-to-t from-brand-subtle via-background to-background` (hero bands), `shadow-brand-100`

## 6. Responsive Verification

- **Mobile (<=480px):** cart shows sticky checkout bar (`bottom-16`) with total + CTA; 2-col wishlist grid with per-card Add to Cart; checkout uses collapsible `MobileOrderSummary` + sticky bar reusing `SubmitButton`; address form stacks 1-col with stacked fields; stepper labels shrink (`text-[10px]`); touch targets ≥40px; tracking form stacks input above button.
- **Tablet (768–1024px):** cart keeps 2-col mobile matrix layout with column headers starting at `md`; checkout address cards go 2-col (`sm:grid-cols-2`); order-received meta ribbons and "What Happens Next" go 3-col at `sm`; wishlist grid 3-col.
- **Desktop (>=1280px):** cart switches to a 12-col matrix with column headers and sticky order summary (`lg:sticky lg:top-40`); checkout shows the desktop sticky summary card and hides mobile elements (`lg:hidden`); wishlist grid 4-col; tracking stepper renders vertical timeline per vendor.
- Note: verified structurally (Tailwind breakpoints + layout/overflow review); an in-browser visual/QA pass at all breakpoints is recommended before merge.

## 7. Before / After

- **Before:** slate/gray and legacy emerald/rose visuals across cart, checkout, order-received, order-tracking, and wishlist; no progress indicators, no status colors, no sticky mobile purchase bars, toast-only validation, dead-end empty states, no wishlist management on the wishlist page, sub-44px wishlist button, and no loading states.
- **After:** full design-token branding (brand/trust/accent/status/success/danger) with WCAG-aware contrast; checkout and receipt steppers; numbered, radio-based address selection with inline adaptive errors and scroll-to-error recovery; free-shipping progress with ARIA; sticky mobile checkout bars; trust signals (secure checkout, COD verify-before-pay, phone helper); order tracking with per-vendor status timeline, plain-language status + icon, last-updated time, cancelled state, and address/discount display; wishlist grid with quick add-to-cart, discount/out-of-stock badges, removal via the shared wishlist button, shadcn `Empty` recovery state, and a Skeleton streaming loader; accessible labels, focus rings, and touch targets throughout.

## 8. Remaining / Follow-up

- **Guest wishlisting:** research (NN/g, Yotpo, Flits) recommends not gating wishlists behind login; the current wishlist page still redirects to `/signin` (server-side requirement). Recommend a guest/local wishlist in localStorage that merges after sign-in.
- **Wishlist alerts:** consider back-in-stock and price-drop notifications for saved items (Flits/Yotpo report these convert best) — requires notification plumbing.
- **Wishlist "Add All to Cart":** the per-card add-to-cart was added; a bulk "Add all to cart" action is a natural follow-up.
- **Order tracking:** the timeline is driven by the vendor order status; if carrier tracking numbers/events are available, surface expected-delivery date, carrier, and linked tracking number (Baymard's 6 key details) and live event timestamps.
- **Copy order number** on the order-tracking header (currently only on the receipt) for parity.
- **Header cart feedback:** NN/g recommends a persistent add-to-cart confirmation; the site relies on toast + cart-count badge — consider a persistent confirmation if toast-only proves insufficient in QA.
- **In-browser QA pass** at all breakpoints (sticky bars, drawer behaviour, Stepper rendering on small screens).
