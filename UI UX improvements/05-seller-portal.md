# Agent Report — Oshudpati UI/UX Improvement

## Page / Scope

- **Assigned page(s):** Seller Portal — dashboard, medicine management (list, new, edit), seller orders, seller shop, seller profile + seller nav shell (layout, sidebar, mobile nav)
- **Agent:** UI/UX engineer (seller portal)
- **Date:** 2026-08-10
- **Files changed:**
  - `src/app/seller/layout.tsx`
  - `src/app/seller/dashboard/page.tsx`
  - `src/app/seller/medicines/page.tsx`
  - `src/app/seller/medicines/new/page.tsx`
  - `src/app/seller/medicines/[id]/page.tsx`
  - `src/app/seller/medicines/_components/MedicineForm.tsx`
  - `src/app/seller/medicines/_components/MedicinesTable.tsx`
  - `src/app/seller/orders/page.tsx`
  - `src/app/seller/orders/_components/OrdersView.tsx`
  - `src/app/seller/orders/_components/OrderActions.tsx`
  - `src/app/seller/shop/page.tsx`
  - `src/app/seller/shop/_components/ShopForm.tsx`
  - `src/app/seller/profile/page.tsx`
  - `src/app/seller/_components/SellerSidebar.tsx`
  - `src/app/seller/_components/MobileSellerNav.tsx`
  - `src/app/seller/_components/SellerPageHeader.tsx` (new)
  - `src/app/seller/_components/OrderStatusBadge.tsx` (new)

## 1. Research Findings (online sources)

1. **Netguru — "Seller UX Playbook: Design Patterns That Work for Marketplace"** (https://www.netguru.com/blog/seller-ux-playbook-design-patterns-marketplace)
   - Seller portals fail when interfaces are overloaded, navigation is inconsistent, and status/state indicators are unclear.
   - Reusable patterns (consistent design systems, modular components) drive adoption and reduce friction.
   - Key pattern: sellers need clear status visibility (in stock / low stock / out of stock) right in operational lists.
2. **EcomDesignPro — "Order History Filters: Better B2B Dashboard UX in 2026"** (https://ecomdesignpro.com/order-history-filters/)
   - Keep the most-used filters (status) visible in the first layer; use plain-language filter labels and count badges.
   - Filters must be transparent — users should see active criteria and counts without resetting the whole page.
3. **Nielsen Norman Group — "Tabs, Used Right"** (https://www.nngroup.com/articles/tabs-used-right/)
   - Tabs are good for lengthy content with clear groupings and concise labels, but the default panel gets the most attention; keep the required/default panel first and labels short.
4. **CustomFit.ai — "Ecommerce Inventory Display: In-Stock, Low-Stock, Pre-Order"** (https://www.customfit.ai/blog/d2c-ecommerce/ecommerce-inventory-display-optimization)
   - Inventory status is a conversion/operational decision: show honest counts with thresholds (low stock ≈ ≤5 units), pair every status with icon + text (never colour alone).

**Patterns applied:** consistent seller nav shell with brand tokens; dashboard answers "what needs my attention" (pending orders, low stock, revenue) above the fold; status = icon + text everywhere (orders and medicine stock/active states); long medicine form broken into 4 labelled tabs with the required panel first; tables = identifier first, actions last, no hover-only actions; destructive delete via confirmation dialog; empty states with CTA; responsive stacking of tables into cards on mobile.

## 2. Problems Found (before)

- [ ] Mixed hardcoded palettes: `slate-*`, `emerald-*`, `amber-*`, `blue-*` scattered across all seller pages instead of design tokens (`brand`, `trust`, `accent`, `status-*`, `surface-card`, `border-default`).
- [ ] Nav active state used green `emerald` (unrelated to brand, inconsistent with trust teal used across the site); no `aria-current`, no visible focus rings.
- [ ] Mobile bottom nav: 10px text, small touch targets (<44px), hardcoded emerald, no focus styles.
- [ ] Dashboard stat cards were plain divs: no `Card` semantics, no links/quick actions, no icon tiles, inconsistent colour usage, no shop status context, recent-orders list lacked status badges with icons.
- [ ] Medicine list table: no active/inactive status badge, no stock level visibility (out/low/in), discount not shown prominently (no "save %" badge), actions had no tooltips/aria-labels, delete confirm styled as default (not destructive), empty state was plain text, mobile got a raw scrollable table instead of cards.
- [ ] Medicine form: single long ungrouped list of ~15 fields; no grouping; no inline validation feedback after submit; `isFeatured` existed in schema/payload but had NO UI control; labels inconsistent; no helper text; primary button used `bg-blue-600`.
- [ ] Orders: filter tabs were custom motion buttons without accessibility/scoping; status badges were colour-only (no icon); status change forced the badge to live inside the select trigger (hard to scan); no icon+text confirmation of next step.
- [ ] Shop form: flat layout, no section header/grouping, no helper text, primary button hardcoded; shop page header inconsistent with other pages.
- [ ] Profile page had no metadata and no seller-specific context (shop link/status).
- [ ] Empty states were plain text divs, no CTA.

## 3. Improvements Made

- **Shared components (new):**
  - `SellerPageHeader` — consistent page title block with brand icon tile, subtitle, optional action (used across dashboard, medicines list/new/edit, orders, shop).
  - `OrderStatusBadge` — icon + text badge for PLACED / PROCESSING / SHIPPED / DELIVERED / CANCELLED using `status-*` tokens + tinted backgrounds.
- **Nav shell:**
  - Replaced `slate/emerald` with `bg-background`, `border-border-default`, `bg-surface-card`, brand hover/active states (`bg-brand-50`, `text-brand-900`, `text-brand-700` icon).
  - Added `aria-current="page"`, `focus-visible:outline` brand rings on nav links; min-height 44px touch targets on mobile nav; brand-tinted active indicator; desktop aside + mobile Sheet + bottom nav all share the same link data.
  - Sheet header shows avatar + name + email with brand tokens; added "Seller" role badge in the bar.
- **Dashboard:**
  - Stat cards now `Card` component, linkable (Medicines → /seller/medicines, Orders/Pending → /seller/orders), icon tiles with token tints, value in `text-brand-900`.
  - Shop status alert: accent warning banner with CTA when no shop; brand info card with "Manage shop" link when a shop exists.
  - Recent Orders: `Card` header + "View all", rows show order number, item count + date, `OrderStatusBadge`, revenue; proper `Empty` state with guidance.
  - Header includes "Add Medicine" primary CTA (`bg-brand-700 hover:bg-brand-600`).
- **Medicine list:**
  - Added `MedicineStatusBadge` (Active/Inactive with icon), `StockBadge` (Out of stock / Low · n / In stock · n with icon + threshold ≤5), and `MedicinePrice` (discount price prominent, original struck through, "-n%" brand badge).
  - Search input with icon + clear button, brand focus ring, aria-label; client-side filtering preserved.
  - Actions: tooltips + aria-labels on edit/delete; delete confirm uses destructive-styled `AlertDialogAction`; deleting state shown.
  - Mobile: stacked cards with status, stock, price, edit/delete buttons (no raw horizontal table scroll).
  - Empty state with CTA on the list page; `Empty` component inside table for zero results.
- **Medicine form (new + edit):**
  - Reorganized 15+ fields into 4 labelled tabs: Details (Basic information), Pricing & Stock, Description, Images — short labelled groups per NN/G tab guidance (default tab "Details" holds the required fields).
  - Inline validation: red `text-danger` field errors from tanstack form meta after submit, `aria-invalid`, `role="alert"`.
  - Added the missing `isFeatured` UI (Switch) — logic already existed in schema/payload.
  - Helper text under each field; required `*` marks; 2-col grid on desktop, 1-col on mobile; brand focus rings on inputs/selects/textarea.
  - Image tab: thumbnails with PRIMARY badge + remove buttons; first image auto-valued as primary (logic preserved).
  - Submit footer: Cancel (outline) + Create/Update (`bg-brand-700 hover:bg-brand-600`), loading spinner.
- **Orders:**
  - Filter tabs → accessible shadcn `Tabs` with per-status counts as `Badge`s (plain-language labels).
  - Status column + mobile cards show `OrderStatusBadge` (icon+text); status change moved to a compact "Update" select (chevron icon) with "Move to <Status>" options; spinner while pending.
  - Desktop table + mobile card layout; `Empty` state for no orders/no filtered orders.
- **Shop:**
  - Page uses `SellerPageHeader` + `Card` wrapper; form now has "Shop identity" section header, logo field with remove, helper text, required mark, brand primary button.
  - All server actions / payload logic preserved.
- **Profile:**
  - Added metadata; seller context card (role, shop status, Manage/Create shop link with `trust` tokens) above the shared profile form.

## 4. shadcn/ui Components Used or Installed

| Component | New/Existing | Purpose |
|---|---|---|
| `Card`, `CardAction`, `CardHeader`, `CardContent`, `CardTitle` | existing | stat cards, recent orders, form wrappers |
| `Badge` | existing | status badges, stock badges, filter counts, save-% badge |
| `Button` | existing | primary CTAs, outline cancel/actions |
| `Input` | existing | search, form fields |
| `Label` | existing | form labels |
| `Textarea` | existing | description fields |
| `Select`, `SelectContent`/`Item`/`Trigger`/`Value` | existing | category/dosage-form pickers, order status update |
| `Switch` | existing | featured medicine toggle |
| `Table` family | existing | medicine + order tables |
| `AlertDialog` family | existing | destructive delete confirmation |
| `Tooltip`, `TooltipProvider` | existing | action affordances (edit) |
| `Empty`, `EmptyHeader`, `EmptyTitle`, `EmptyDescription` | existing | empty states |
| `Tabs`, `TabsList`, `TabsTrigger` | existing | order status filters + medicine form groups |
| `Avatar`, `AvatarImage`, `AvatarFallback` | existing | user/seller avatar in nav shell |
| `Sheet`, `SheetContent`, `SheetTrigger`, `SheetTitle` | existing | mobile seller menu |
| `PaginationControls` (shared) | existing | list/table pagination |
| `PageSection` (shared, motion) | existing | section entrance animation |

No new shadcn components were installed.

## 5. Design Tokens Used

- `bg-background`, `bg-card`, `bg-surface-card`, `border-border-default`
- `bg-brand-50`, `border-brand-100`, `border-brand-200`, `bg-brand-500`, `text-brand-700`, `text-brand-800`, `text-brand-900`, `bg-brand-700 hover:bg-brand-600 active:bg-brand-800`
- `text-trust-600`/`hover:text-trust-700`, `bg-trust-50`
- `text-accent-600`, `bg-accent-50`, `border-accent-200`
- Status (always with icon + text): `text-status-placed` (blue-50 bg), `text-status-processing` (amber-50 bg), `text-status-shipped` (violet-50 bg), `text-status-delivered` (emerald-50 bg), `text-status-cancelled` (red-50/red-600 bg)
- `text-danger` for validation errors
- Default Tailwind palette tints (`slate/blue/amber/violet/emerald/red-50`) only as badge backgrounds paired with the semantic text token.

## 6. Responsive Verification

- **Mobile (<=480px):** verified in code — bottom nav (min 44px targets) + Sheet menu; main `pb-24` avoids nav overlap; medicine/order tables render as stacked cards; forms collapse to 1 col; header action buttons go full-width; tab bars scroll horizontally; tappable edit/delete buttons ≥36x36px.
- **Tablet (768–1024px):** verified in code — sidebar hidden below `md` (Sheet + bottom nav take over); grid 2-col stats stays 2-col; forms switch to 2-col at `md`; tables visible from `md` up.
- **Desktop (>=1280px):** verified in code — sticky sidebar `w-64`, 4-col stat grid at `lg`, max-width container (`max-w-360` ≈ 1440px), tables with identifier-first + actions-last columns, hover states on rows.
- (Live browser verification not performed in this session; verified via code/class audit.)

## 7. Before / After

- **Before:** inconsistent slate/emerald palette; nav without focus states; raw tables on mobile; long ungrouped medicine form with no inline errors; colour-only status indicators; flat shop form; plain-text empty states; `isFeatured` unusable (no control).
- **After:** cohesive teal/blue healthcare tokens across the seller shell; accessible nav (aria-current, focus rings, touch targets); dashboard with actionable stat cards + shop context + recent orders with status badges; readable medicine list (status, stock, discount, sold, tooltips); tabbed medicine form with inline validation and a working featured toggle; order management with accessible status filters + icon+text badges + clear next-step actions; shop and profile pages consistent and actionable.

## 8. Remaining / Follow-up

- Medicine form uses `Tabs`; required fields are concentrated on the default "Details" tab, but a submit from another tab with missing required fields shows errors on an inactive tab. Consider auto-switching to the first tab with errors, or a form-level error summary near the submit button.
- Live browser verification (desktop/tablet/mobile) recommended for final sign-off.
- `totalRevenue`/`vendorSubtotal` formatting assumes numeric values from the API; add defensive `Number()` casts if the API ever returns strings.
