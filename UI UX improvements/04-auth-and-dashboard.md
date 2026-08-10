# Agent Report — 04: Auth Flow + Customer Dashboard

## Page / Scope

- **Assigned page(s):** Authentication flow (signin, signup, verify-email, email-verified, auth-callback) and Customer dashboard (overview, orders, addresses, profile, account)
- **Agent:** opencode
- **Date:** 2026-08-10
- **Files changed:**
  - `src/app/(auth)/layout.tsx`
  - `src/app/(auth)/_components/SocialAuth.tsx`
  - `src/app/(auth)/_components/Signout.tsx`
  - `src/app/(auth)/signin/page.tsx`, `src/app/(auth)/signin/_components/SignInForm.tsx`
  - `src/app/(auth)/signup/page.tsx`, `src/app/(auth)/signup/_components/SignupForm.tsx`
  - `src/app/auth-callback/_components/AuthCallbackContent.tsx`
  - `src/app/email-verified/_components/EmailVerifiedContent.tsx`
  - `src/app/verify-email/_components/VerifyEmailContent.tsx`
  - `src/app/dashboard/layout.tsx`
  - `src/app/dashboard/_components/{DashboardSidebar, MobileDashboardNav, WelcomeHero, StatCards, ActiveOrders, RecentOrdersList, QuickReorder}.tsx`
  - `src/app/dashboard/orders/page.tsx`, `src/app/dashboard/orders/_components/{OrderList, OrderCard}.tsx`
  - `src/app/dashboard/addresses/page.tsx` (clean), `src/app/dashboard/addresses/_components/{AddressManager, AddressFormDialog}.tsx`
  - `src/components/shared/Signout.tsx`
  - `src/components/shared/user/{ProfileForm, ProfilePage}.tsx`
  - `src/app/(public)/account/page.tsx`, `src/app/(public)/account/_components/Signout.tsx`

## 1. Research Findings

- **Nielsen Norman / Baymard:** sign-in forms should be single-column, no `password`-strength wall, show errors inline; password visibility toggle is a must-have; never lock users out silently — verification-gated flows need a resend path and clear next step (https://baymard.com/blog/password-input).
- **NN/g:** distinguish "errors that block" from "information" — error messages must be adjacent to the offending field and use icon + text; success states need explicit next-step CTA (https://www.nngroup.com/articles/errors-form-design/).
- **Gov.uk / WCAG:** labels above inputs, min 44px tap targets, visible focus indicator (2px ring), links/buttons readable via `aria-label`/`aria-pressed` when icon-only (https://www.w3.org/WAI/WCAG22/).

## 2. Problems Found (before)

- [x] **Inconsistent branding:** hardcoded `emerald-*`, `slate-*`, `red-*` palettes across auth and dashboard despite design tokens existing in `globals.css` (`brand`, `trust`, `status-*`, `muted`, `border-default`).
- [x] **Accessibility:** password field had no show/hide toggle; focus rings absent on many interactive elements; icon-only toggle button lacked `aria-label`; dashboard signout was a non-semantic `div`/no keyboard support.
- [x] **Auth state UX:** signin/signup buttons lacked pending/loading states and double-submit guards; verify-email form reused `div` click handler; `SignupForm` did not send `callbackURL` correctly (verification flow could not be completed).
- [x] **Invalid Tailwind classes:** `border-border-subtle`, `bg-danger-subtle`, `text-danger-border` used but only `border-default`/`danger` tokens exist — silently no-op styles.
- [x] **React lint error (blocking):** `AddressFormDialog` called `setFormData` synchronously inside `useEffect` (`react-hooks/set-state-in-effect`) — cascading renders.
- [x] **Unescaped entities:** `don't`, `We've` in JSX text (react/no-unescaped-entities) in verify-email content.
- [x] **Dead link:** signin "Forgot password?" pointed to a non-existent route and was removed.
- [x] **Responsive:** dashboard nav only existed as a desktop sidebar; no mobile bottom navigation; mobile sheet reused same links inconsistently.

## 3. Improvements Made

- **Design tokens everywhere:** replaced all hardcoded `emerald/slate/red/amber/violet` with tokens — `bg-brand-700`, `hover:bg-brand-600`, `bg-brand-subtle`, `text-brand-900`, `border-border-default`, `bg-muted`, `text-muted-foreground`, `text-destructive`, `bg-danger/10`, `text-status-*`, `text-info`, `bg-trust-50`, `text-trust-600`.
- **Password visibility toggle** on signin + signup using `InputGroup`/`InputGroupButton` with `aria-pressed`, `aria-label`, `aria-hidden` on icons.
- **Loading/submitting states** on signin, signup, resend-verification, and all three signout components (disabled + spinner + `cursor-wait`), preventing double submits.
- **Auth callback:** kept existing role-based redirect logic, upgraded the "logging you in" screen with brand tokens and motion (spinner + check).
- **Email verification flow fixed:** `SignupForm` now passes `callbackURL` = `${FRONTEND_URL}/email-verified` (+ optional `redirect`); resend button on verify-email works with the user's email and shows a "check spam / promotions" info panel; `EmailVerifiedContent` keeps countdown auto-redirect but adds explicit Continue CTA and resend hint.
- **Dashboard layout:** brand-token header/sidebar/mobile-sheet; sticky desktop sidebar (`top-16`, `min-h-[calc(100vh-4rem)]`); brand gradient `WelcomeHero` with animated decorative circles and live greeting.
- **Mobile navigation:** added `MobileDashboardNav` bottom tab bar (md:hidden) with active indicator; reused `DashboardSidebar` for sheet + desktop.
- **Signout consistency:** three signout components (auth sheet, dashboard shared, account card) all converted to accessible buttons with pending state, danger styling, focus rings.
- **Order status styling:** `STATUS_BADGES`/`STATUS_COLORS` now use `status-*` tokens (`bg-status-delivered/10 text-status-delivered border-status-delivered/20`, etc.) in `RecentOrdersList` + `OrderCard`; cancelled consistently uses `bg-status-cancelled/...`/`text-danger`.
- **Addresses:** card grid, empty state, edit/delete actions and the address form dialog converted to tokens; form dialog no longer holds stale state (see §4).
- **React lint fix:** removed `setState-in-effect` from `AddressFormDialog` by initializing `useState` from `editingAddress` and remounting the dialog per open via `key={formVersion}` (incremented in `handleOpenModal`). Form resets exactly as before, but lints clean.
- **Focus + contrast:** added `focus-visible:ring-2 focus-visible:ring-brand-600` (or `-danger`) to interactive elements; replaced `text-slate-400/500` with readable `text-muted-foreground`; converted amber/violet/blue accent icon chips to `bg-brand-subtle text-brand-700`.

## 4. shadcn/ui Components Used

| Component | New/Existing | Purpose |
|---|---|---|
| `Field` / `FieldGroup` / `FieldLabel` / `FieldError` / `FieldDescription` | existing | form fields + inline errors in signin/signup |
| `InputGroup` / `InputGroupButton` / `InputGroupInput` | existing | email/password inputs + password toggle |
| `Card` | existing | signin/signup cards |
| `Button` | existing | all CTAs (default variant = brand `--primary`) |
| `RadioGroup` / `RadioGroupItem` | existing | customer/seller role picker |
| `Sheet` | existing | mobile nav drawer |
| `Avatar` / `Badge` | existing | user identity (dashboard layout, account) |
| `Dialog` | existing | address create/edit modal |

## 5. Design Tokens Used

- `bg-brand-700`, `hover:bg-brand-600`, `active:bg-brand-800`, `bg-brand-50`, `bg-brand-100`, `bg-brand-subtle`, `text-brand-700/900`, `border-brand-200/700`, `from-brand-800 via-brand-700 to-brand-500`
- `bg-trust-50`, `text-trust-600`
- `bg-danger/10`, `bg-danger/20`, `text-danger`, `border-danger/20/40`, `focus-visible:ring-danger`
- `text-info`, `bg-info/10`, `border-info/20`
- `bg-status-placed|processing|shipped|delivered|cancelled` (+ `/10`, `/20` opacity variants)
- `bg-card`, `bg-muted`, `bg-muted/30`, `text-foreground`, `text-muted-foreground`, `border-border-default`, `bg-surface-card`

## 6. Responsive Verification

- **Mobile (<=480px):** dashboard bottom nav shown, sidebar hidden behind sheet; stat cards 2-col; address form dialog `sm:max-w-125` full-width below sm; hero stacks vertically with wrap-around stat chips.
- **Tablet (768–1024px):** sidebar visible (`md:flex`), stats become 4-col at `lg`; hero row/column switch at `md`.
- **Desktop (>=1280px):** `max-w-360` container, sticky sidebar with `min-h-[calc(100vh-4rem)]`, content `pb-24 md:pb-6` so bottom nav never overlaps.
- Note: visual confirmation in browser still pending — logic verified via `tsc --noEmit` + `eslint`.

## 7. Before / After

- **Before:** green `emerald-*` accents inconsistent with `--primary`/`--brand` tokens; slate-based text lost contrast; no loading states; a blocking lint error; dead link; no mobile nav.
- **After:** single token palette (brand/trust/status), consistent 12px–12rem rounded corners, visible focus rings, pending states on every async action, working email-verification loop with clear next steps, mobile bottom nav, and lint/typecheck clean for every changed file.

## 8. Remaining / Follow-up

- [ ] Run `npm run build` and visually verify pages (signin, signup, verify-email, dashboard, orders, addresses, account) at mobile/tablet/desktop widths.
- [ ] `AddressFormDialog`: replace `confirm()` in `OrderCard.handleCancelVendor` with the `Dialog`/alert pattern used elsewhere.
- [ ] `OrderCard` expand/collapse: consider `aria-expanded`/`aria-controls` on the toggle button for screen readers.
- [ ] Consider a shared `OrderStatusBadge` component (3 duplicated badge maps across `RecentOrdersList`, `OrderCard`, and possibly tracking page).
- [ ] `SocialAuth`/social buttons are inert placeholders — wire OAuth providers when the backend supports them.
- [ ] Global scan still pending for `slate-*`/`emerald-*`/`red-*` leftovers in the remaining marketplace pages (cart, checkout, tracking, shop, categories, seller/admin).
