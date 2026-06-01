# TASK-02 — Design System & Layout Shell

Date: 2026-05-31
Area: frontend
Type: feat

## Context

Second task from `docs/plans/02-TASK-design-system.md`. Implement the design system from `DESIGN-Ops.md` and the responsive App Shell (mobile + desktop) matching the Stitch mockups.

## What changed

### Design tokens (`frontend/src/index.css`)
- Tailwind v4 CSS-first `@theme`: primary (teal), AI accent (violet), neutral, semantic palettes; type scale; radius; shadows; ease curve (DESIGN §5–§9, §16).
- Gradient utilities `.gradient-ai-card`, `.gradient-soft-ai` (DESIGN §5.5).

### Fonts (`frontend/index.html`)
- Plus Jakarta Sans + Inter via Google Fonts; `lang="id"`, title.

### UI primitives (`frontend/src/components/ui/`)
- `button.tsx` — primary/secondary/ghost/danger/ai variants, 44px height, 12px radius (DESIGN §12.1).
- `card.tsx` — white, 16px radius, soft shadow (DESIGN §12.2).

### Shared components (`frontend/src/components/shared/`)
- `StatusBadge.tsx` — `PaymentStatusBadge`, `OrderStatusBadge`, `CustomerTypeBadge` driven by `src/lib/status.ts` (DESIGN §12.5).
- `EmptyState.tsx` — friendly empty state with CTA (DESIGN §12.10).
- `AIGradientCard.tsx` — gradient AI summary hero (DESIGN §12.3).

### Layout (`frontend/src/components/layout/`)
- `nav-config.ts` — sidebar + mobile nav items.
- `MobileHeader.tsx` — sticky header (avatar, greeting, bell).
- `MobileBottomNav.tsx` — floating bottom nav + center Add quick-action sheet.
- `DesktopSidebar.tsx` — fixed 260px sidebar, active = primary-soft.
- `TopBar.tsx` — business name, search, user profile.
- `AppShell.tsx` — composes responsive layout (sidebar/topbar desktop, header/bottom-nav mobile).

## Impact

- `App.tsx` now renders the dashboard placeholder inside `AppShell`.
- Establishes the visual + structural foundation every Phase 1 page builds on.

## How to test

- `cd frontend && npm run build` → builds clean.
- `npx vitest run` → `StatusBadge.test.tsx` 6 tests pass (status→label/tone mapping incl. partial→warning, ready→ai, cancelled→neutral).

## Rollback plan

- Revert `src/index.css`, `index.html`, and delete `src/components/{ui,shared,layout}`, `src/lib/status.ts`.
