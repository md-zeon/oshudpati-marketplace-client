# Agent Report 09 - Shadcn Sidebar Adoption for All Dashboards - Oshudpati UI/UX Improvement

## Page / Scope

- **Scope:** Replace the hand-rolled, `position: sticky`-based dashboards (customer dashboard, seller portal, admin portal) with the official shadcn `Sidebar` component so the sidebar is fixed and no longer scrolls with the page, and the navigation follows the project's design system.
- **Agent:** big-pickle (opencode)
- **Date:** 2026-08-10
- **Files changed:**
  - `src/app/globals.css` - added `--sidebar-*` design tokens + `no-scrollbar` utility
  - `src/app/dashboard/_components/DashboardSidebar.tsx` - refactored to `SidebarMenuButton`
  - `src/app/seller/_components/SellerSidebar.tsx` - refactored to `SidebarMenuButton`
  - `src/app/admin/_components/AdminSidebar.tsx` - refactored to `SidebarMenuButton`
  - `src/app/dashboard/layout.tsx` - rebuilt on `SidebarProvider`/`Sidebar`/`SidebarInset`
  - `src/app/seller/layout.tsx` - rebuilt on shadcn `Sidebar`
  - `src/app/admin/layout.tsx` - rebuilt on shadcn `Sidebar`

## 1. Problem

- All three dashboards used a custom `<aside>` with `sticky top-16` + `backdrop-blur` (dashboard/layout.tsx, seller/layout.tsx, admin/layout.tsx). Sticky is unreliable in this setup and the pattern was bespoke, not shadcn.
- The project already shipped the full shadcn `src/components/ui/sidebar.tsx` (SidebarProvider, Sidebar, SidebarInset, SidebarMenu*, SidebarRail, keyboard shortcut, mobile Sheet), but it was **never imported anywhere** and could not render: `globals.css` had no `--sidebar-*` CSS variables and no `no-scrollbar` utility that the component depends on.

## 2. Changes

### Design tokens (globals.css)
- Added brand-tinted shadcn sidebar tokens to `:root` (`--sidebar: #ffffff`, `--sidebar-foreground`, `--sidebar-primary: brand-700`, `--sidebar-accent: brand-50`, `--sidebar-accent-foreground: brand-900`, `--sidebar-border: brand-100`, `--sidebar-ring: brand-600`) and mirrored them in `@theme inline` as `--color-sidebar-*`.
- Added the `@utility no-scrollbar` rule required by `SidebarContent`.

### Layouts
- Each layout is now `SidebarProvider` → `Sidebar` (collapsible "offcanvas") + `SidebarInset`.
- The shadcn desktop sidebar is `fixed inset-y-0` and independent of the page scroll; the content area (`SidebarInset`) scrolls normally, and a collapsible off-canvas toggle (SidebarTrigger / rail / Ctrl+B) is built in.
- On mobile the shadcn `Sidebar` automatically renders a slide-in Sheet containing the same nav (user card, menu, back-to-store, sign-out); the existing fixed bottom nav bars (MobileDashboardNav / MobileSellerNav / MobileAdminNav) are preserved for quick switching.
- Sidebar structure per layout: `SidebarHeader` (avatar + name + email identity card), `SidebarContent` (group label + nav), `SidebarFooter` (separator, "Back to Store", sign-out), `SidebarRail`.
- Admin keeps its trust-blue identity: the `Sidebar` receives `style` overrides for `--sidebar-accent`/`--sidebar-border`/`--sidebar-ring` to the trust palette, and the content area keeps `var(--admin-bg)`; customer dashboard keeps `var(--surface-card)`.
- Menu rows use `SidebarMenuButton` with `isActive` (now also highlights nested routes like `/dashboard/orders/123`) and 48px `size="lg"` targets. Row components no longer hard-code hover/active colors — they consume the sidebar tokens.

## 3. Notes

- Dropped the hand-rolled mobile `Sheet` markup from each layout (the shadcn Sidebar provides it) and removed the now-unused lucide imports.
- The old `max-w-360` centered page wrapper was replaced by a full-bleed dashboard shell (standard shadcn layout); pages keep their own internal width constraints.

## 4. Verification

- `npx eslint` on all changed files + `src/components/ui/sidebar.tsx` → 0 errors.
- `npx tsc --noEmit` → 0 errors.
- `pnpm build` → success; compiled CSS confirmed to contain `--sidebar-accent`, `no-scrollbar`, and `bg-sidebar` utilities.
